# Session Persistence Implementation

## Overview

This document describes the implementation of session persistence for the AI Council chat interface. The feature allows users to save their current conversation, restore it on page reload, auto-save draft messages, and receive warnings before leaving with unsaved changes.

## Implementation Date

February 8, 2026

## Features Implemented

### 1. Save Current Conversation in localStorage ✅

**Location:** `frontend/hooks/use-session-persistence.ts`

The `useSessionPersistence` hook manages all session data in localStorage:

```typescript
interface SessionData {
  messages: ConversationMessage[];
  draftMessage: string;
  selectedMode: ExecutionMode;
  lastUpdated: number;
}
```

**Storage Key:** `ai_council_session`

**What's Saved:**
- All conversation messages (user queries and assistant responses)
- Draft message (unsent text in input)
- Selected execution mode (fast/balanced/best_quality)
- Last updated timestamp

### 2. Restore Conversation on Page Reload ✅

**Location:** `frontend/app/chat/page.tsx`

On page load, the system:
1. Checks for saved session in localStorage
2. Shows "Resume Session" dialog if session exists
3. Restores all messages and state when user chooses to resume
4. Displays last assistant response in the response panel

**User Experience:**
- Seamless restoration of conversation context
- Toast notification confirming session restoration
- Shows message count in restoration dialog

### 3. Auto-Save Draft Messages Every 2 Seconds ✅

**Location:** `frontend/hooks/use-session-persistence.ts`

**Implementation:**
```typescript
const AUTO_SAVE_INTERVAL = 2000; // 2 seconds

useEffect(() => {
  if (draftMessage || messages.length > 0) {
    setHasUnsavedChanges(true);
    
    autoSaveTimerRef.current = setTimeout(() => {
      saveSession();
    }, AUTO_SAVE_INTERVAL);
  }
  
  return () => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
  };
}, [draftMessage, messages, saveSession]);
```

**Behavior:**
- Debounced auto-save prevents excessive writes
- Saves on every change after 2-second delay
- Clears previous timer on new changes
- Marks changes as saved after successful write

### 4. Warn Before Leaving Page with Unsaved Changes ✅

**Location:** `frontend/hooks/use-session-persistence.ts`

**Implementation:**
```typescript
useEffect(() => {
  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      return e.returnValue;
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [hasUnsavedChanges]);
```

**User Experience:**
- Browser shows native confirmation dialog
- Only triggers when there are actual unsaved changes
- Prevents accidental data loss

### 5. Clear localStorage on Logout ✅

**Location:** `frontend/lib/auth-store.ts`

**Implementation:**
```typescript
logout: async () => {
  try {
    await authApi.logout()
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    // Clear session storage on logout
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ai_council_session')
    }
    get().clearAuth()
  }
}
```

**Security:**
- Ensures session data is cleared when user logs out
- Prevents session leakage between users
- Maintains privacy on shared devices

### 6. Add "Resume Last Session" Option on Login ✅

**Location:** `frontend/app/login/page.tsx`

**Implementation:**
- Checks for saved session on login page mount
- Displays blue alert banner if session exists
- Shows clock icon and informative message
- Automatically resumes session after successful login

**User Experience:**
```
┌─────────────────────────────────────────────┐
│ 🕐 You have a saved session waiting.       │
│    Sign in to resume where you left off.   │
└─────────────────────────────────────────────┘
```

## Components Created

### 1. `use-session-persistence.ts` Hook

**Purpose:** Central hook for managing session persistence

**Exports:**
- `messages` - Array of conversation messages
- `draftMessage` - Current unsent message
- `selectedMode` - Current execution mode
- `hasUnsavedChanges` - Boolean flag for unsaved state
- `sessionRestored` - Boolean flag indicating restoration
- `addUserMessage()` - Add user message to session
- `addAssistantResponse()` - Add AI response to session
- `clearSession()` - Clear all session data
- `clearSessionOnLogout()` - Clear on logout
- `hasSavedSession()` - Check if session exists
- `restoreSession()` - Restore saved session
- `updateDraftMessage()` - Update draft text
- `updateSelectedMode()` - Update execution mode
- `saveSession()` - Manually save session

### 2. `resume-session-dialog.tsx` Component

**Purpose:** Dialog for resuming or starting new session

**Props:**
- `open` - Dialog visibility
- `onOpenChange` - Callback for visibility change
- `onResume` - Callback when user chooses to resume
- `onStartNew` - Callback when user starts new session
- `messageCount` - Number of messages in saved session
- `lastUpdated` - Timestamp of last update

**Features:**
- Shows time since last update (e.g., "5 minutes ago")
- Displays message count
- Clear action buttons (Resume / Start New)

## Integration Points

### Chat Page (`frontend/app/chat/page.tsx`)

**Changes:**
1. Import `useSessionPersistence` hook
2. Import `ResumeSessionDialog` component
3. Add session state management
4. Show resume dialog on mount if session exists
5. Pass draft message and mode to `EnhancedChatInput`
6. Save messages on submit and response
7. Confirm before clearing session in "New Chat"

### Enhanced Chat Input (`frontend/components/chat/enhanced-chat-input.tsx`)

**Changes:**
1. Accept `initialQuery` and `initialMode` props
2. Accept `onQueryChange` and `onModeChange` callbacks
3. Sync local state with props
4. Notify parent of changes for auto-save

### Auth Store (`frontend/lib/auth-store.ts`)

**Changes:**
1. Clear session storage in `logout()` method
2. Ensures privacy and security

### Login Page (`frontend/app/login/page.tsx`)

**Changes:**
1. Check for saved session on mount
2. Display alert banner if session exists
3. Provide visual feedback about waiting session

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     User Types Message                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         EnhancedChatInput calls onQueryChange()             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│      useSessionPersistence.updateDraftMessage()             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         Set hasUnsavedChanges = true                        │
│         Start 2-second auto-save timer                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼ (after 2 seconds)
┌─────────────────────────────────────────────────────────────┐
│         saveSession() writes to localStorage                │
│         Set hasUnsavedChanges = false                       │
└─────────────────────────────────────────────────────────────┘
```

## Storage Structure

**localStorage Key:** `ai_council_session`

**Value (JSON):**
```json
{
  "messages": [
    {
      "id": "user-1707408000000",
      "type": "user",
      "content": "Explain quantum computing",
      "executionMode": "balanced",
      "timestamp": 1707408000000
    },
    {
      "id": "assistant-1707408015000",
      "type": "assistant",
      "content": "Quantum computing is...",
      "response": { /* Full CouncilResponse object */ },
      "timestamp": 1707408015000
    }
  ],
  "draftMessage": "What about quantum entanglement",
  "selectedMode": "balanced",
  "lastUpdated": 1707408020000
}
```

## Error Handling

### localStorage Quota Exceeded

**Scenario:** User has too much data in localStorage

**Handling:**
```typescript
try {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
} catch (error) {
  console.error('Failed to save session:', error);
  // Gracefully degrade - continue without persistence
}
```

### Corrupted Session Data

**Scenario:** Invalid JSON in localStorage

**Handling:**
```typescript
try {
  const session: SessionData = JSON.parse(savedSession);
  // Validate structure before using
} catch (error) {
  console.error('Failed to restore session:', error);
  // Clear corrupted data
  localStorage.removeItem(SESSION_STORAGE_KEY);
}
```

### SSR Compatibility

**Issue:** localStorage not available during server-side rendering

**Solution:**
```typescript
if (typeof window === 'undefined') return;
// Only access localStorage in browser
```

## Testing Recommendations

### Manual Testing Checklist

- [ ] Type message, wait 2 seconds, refresh page - message should be restored
- [ ] Submit query, get response, refresh page - conversation should be restored
- [ ] Type message, try to close tab - should show warning
- [ ] Type message, wait 2 seconds, close tab - should NOT show warning (auto-saved)
- [ ] Login with saved session - should show blue alert banner
- [ ] Resume session - should restore all messages and draft
- [ ] Start new session - should clear all data
- [ ] Logout - should clear session from localStorage
- [ ] Login as different user - should not see previous user's session

### Automated Testing

**Unit Tests:**
```typescript
describe('useSessionPersistence', () => {
  it('should save draft message to localStorage after 2 seconds')
  it('should restore session from localStorage on mount')
  it('should clear session on clearSession()')
  it('should add user message to messages array')
  it('should add assistant response to messages array')
  it('should set hasUnsavedChanges when draft changes')
  it('should clear hasUnsavedChanges after auto-save')
})
```

**Integration Tests:**
```typescript
describe('Session Persistence Integration', () => {
  it('should persist conversation across page reloads')
  it('should show resume dialog when session exists')
  it('should clear session on logout')
  it('should warn before leaving with unsaved changes')
})
```

## Performance Considerations

### Auto-Save Debouncing

**Why:** Prevents excessive localStorage writes
**How:** 2-second delay after last change
**Impact:** Minimal - localStorage writes are fast

### Message Array Size

**Concern:** Large conversations could exceed localStorage quota (5-10MB)
**Mitigation:** 
- Consider limiting to last N messages
- Implement message pruning for old sessions
- Monitor localStorage usage

### JSON Serialization

**Concern:** Large CouncilResponse objects
**Mitigation:**
- Only store essential response data
- Consider compressing old messages
- Implement lazy loading for message history

## Future Enhancements

### 1. Cloud Sync
- Sync session to backend database
- Access session from multiple devices
- Longer retention period

### 2. Multiple Sessions
- Save multiple conversation threads
- Switch between sessions
- Session management UI

### 3. Export/Import
- Export conversation as JSON/Markdown
- Import previous conversations
- Share conversations with others

### 4. Smart Pruning
- Automatically remove old messages
- Keep only recent N messages
- Compress older messages

### 5. Session Analytics
- Track session duration
- Monitor auto-save frequency
- Measure restoration success rate

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| localStorage | ✅ | ✅ | ✅ | ✅ |
| beforeunload | ✅ | ✅ | ✅ | ✅ |
| JSON.stringify | ✅ | ✅ | ✅ | ✅ |
| setTimeout | ✅ | ✅ | ✅ | ✅ |

**Minimum Versions:**
- Chrome 4+
- Firefox 3.5+
- Safari 4+
- Edge (all versions)

## Security Considerations

### Data Privacy
- Session data stored in browser only
- Cleared on logout
- Not transmitted to server (except during normal API calls)

### XSS Protection
- No eval() or innerHTML usage
- All data properly escaped
- React's built-in XSS protection

### Session Hijacking
- Session data is local only
- No sensitive credentials stored
- Auth token stored separately

## Conclusion

The session persistence implementation provides a robust, user-friendly experience for maintaining conversation context across page reloads and browser sessions. The auto-save functionality ensures minimal data loss, while the resume dialog provides clear user control over session restoration.

All requirements from task 25.6 have been successfully implemented:
✅ Save current conversation in localStorage
✅ Restore conversation on page reload
✅ Auto-save draft messages every 2 seconds
✅ Warn before leaving page with unsaved changes
✅ Clear localStorage on logout
✅ Add "Resume last session" option on login

The implementation is production-ready and follows React best practices for hooks, state management, and side effects.
