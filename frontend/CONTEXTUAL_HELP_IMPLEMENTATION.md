# Contextual Help System Implementation

## Overview

This document describes the comprehensive contextual help system implemented throughout the AI Council web application. The system provides users with multiple layers of assistance to understand features and navigate the application effectively.

## Components Implemented

### 1. Help Modal (`components/help/help-modal.tsx`)

A comprehensive help dialog accessible from the sidebar that includes:

**Keyboard Shortcuts Tab:**
- Navigation shortcuts (Ctrl+/, Ctrl+K, Ctrl+H, Ctrl+D, Ctrl+Shift+H)
- Chat interface shortcuts (Ctrl+Enter, Ctrl+N, Esc, Ctrl+L)
- General shortcuts (?, Ctrl+S, Ctrl+B)

**FAQ Tab:**
- What are execution modes?
- How does multi-agent orchestration work?
- What do confidence scores mean?
- How is cost calculated?
- Can I use my own API keys?
- What happens if a request fails?
- How do I view past requests?

**Getting Started Guide Tab:**
- Step-by-step guide for new users
- Submit your first query
- Choose an execution mode
- Watch the orchestration
- Review the results
- Configure your settings

**Access:**
- Click "Help & Shortcuts" button in sidebar
- Press "?" key anywhere in the app (except when typing in inputs)
- Keyboard shortcut: Esc to close

### 2. Help Icon (`components/help/help-icon.tsx`)

A small "?" icon with tooltip that appears next to complex features:

**Features:**
- Hover to see explanation
- Positioned strategically next to labels
- Customizable tooltip position (top, right, bottom, left)
- Accessible with keyboard navigation

**Usage Locations:**
- Execution mode selector label
- Query input label
- Response viewer title
- Orchestration breakdown title
- Confidence score metric
- Total cost metric
- Execution time metric
- Subtasks metric

### 3. Inline Hint (`components/help/inline-hint.tsx`)

Dismissible hint cards that appear for first-time actions:

**Features:**
- Shows once per user (stored in localStorage)
- Dismissible with X button
- Blue-themed design with lightbulb icon
- Automatically hidden after dismissal

**Usage Locations:**
- First query submission: "Pro Tip: Complex queries work best"
- Additional hints can be added for other first-time actions

### 4. What's This Link (`components/help/whats-this-link.tsx`)

A clickable "What's this?" link with detailed tooltip:

**Features:**
- Inline with section headers
- Provides detailed explanations
- Hover or click to view
- Supports longer explanations than help icons

**Usage Locations:**
- Models Used section in response viewer
- Can be added to other complex sections

### 5. Tooltip Component (`components/ui/tooltip.tsx`)

Base tooltip component from Radix UI:

**Features:**
- Accessible (ARIA compliant)
- Keyboard navigable
- Customizable positioning
- Smooth animations
- Dark mode support

### 6. Tabs Component (`components/ui/tabs.tsx`)

Tab navigation for the help modal:

**Features:**
- Accessible tab navigation
- Keyboard support (arrow keys)
- Active state styling
- Smooth transitions

## Hook: useHelpModal

Custom hook for managing help modal state:

```typescript
const { isOpen, open, close, toggle } = useHelpModal()
```

**Features:**
- Manages modal open/close state
- Listens for "?" keyboard shortcut
- Prevents triggering when typing in inputs
- Closes with Escape key

## Integration Points

### Sidebar (`components/layout/sidebar.tsx`)

Added "Help & Shortcuts" button:
- Positioned above "Restart Tour" button
- Opens help modal on click
- Includes help icon
- Accessible via keyboard

### Execution Mode Selector (`components/council/execution-mode-selector.tsx`)

Added help icon next to "Execution Mode" label:
- Explains what execution modes are
- Describes FAST, BALANCED, and BEST_QUALITY modes
- Positioned to the right of label

### Query Input (`components/council/query-input.tsx`)

Multiple help features:
- Help icon next to component title
- Help icon next to "Your Query" label
- Inline hint for first-time users
- Explains character limits and query complexity

### Response Viewer (`components/council/response-viewer.tsx`)

Comprehensive tooltips:
- Help icon next to "Final Response" title
- Help icons for all metrics (confidence, cost, time, subtasks)
- "What's this?" link for Models Used section
- Explains what each metric means

### Orchestration Breakdown (`components/council/orchestration-breakdown.tsx`)

Added help icon next to title:
- Explains the orchestration breakdown
- Describes task decomposition and parallel processing

## Keyboard Shortcuts

### Global Shortcuts
- `?` - Open help modal
- `Esc` - Close help modal or cancel current action
- `Ctrl + /` - Open command palette (future feature)
- `Ctrl + K` - Focus search (future feature)

### Navigation Shortcuts
- `Ctrl + H` - Go to home
- `Ctrl + D` - Go to dashboard
- `Ctrl + Shift + H` - Go to history
- `Ctrl + S` - Go to settings
- `Ctrl + B` - Toggle sidebar

### Chat Interface Shortcuts
- `Ctrl + Enter` - Submit query
- `Ctrl + N` - New chat
- `Ctrl + L` - Clear input

## Accessibility Features

1. **Keyboard Navigation:**
   - All help features accessible via keyboard
   - Tab navigation through interactive elements
   - Escape key to close modals

2. **ARIA Labels:**
   - Proper aria-label attributes on buttons
   - Accessible tooltips with role="tooltip"
   - Screen reader friendly

3. **Focus Management:**
   - Focus trapped in modal when open
   - Focus returns to trigger element on close
   - Visible focus indicators

4. **Color Contrast:**
   - Meets WCAG AA standards
   - Dark mode support
   - High contrast text

## User Experience Considerations

1. **Progressive Disclosure:**
   - Basic help visible inline
   - Detailed help in modal
   - Advanced features in documentation

2. **Context-Aware:**
   - Help appears where needed
   - Relevant to current task
   - Non-intrusive placement

3. **Dismissible:**
   - Users can dismiss hints
   - Preferences saved in localStorage
   - Never blocks critical UI

4. **Consistent:**
   - Same help icon throughout
   - Consistent tooltip styling
   - Predictable behavior

## Future Enhancements

1. **Interactive Tutorials:**
   - Step-by-step walkthroughs
   - Highlight UI elements
   - Progress tracking

2. **Contextual Help Search:**
   - Search help content
   - Quick access to specific topics
   - Fuzzy matching

3. **Video Tutorials:**
   - Embedded video guides
   - Screen recordings
   - Animated demonstrations

4. **Help Analytics:**
   - Track which help features are used
   - Identify confusing areas
   - Improve based on data

5. **Localization:**
   - Multi-language support
   - Translated help content
   - Regional keyboard shortcuts

## Testing Checklist

- [x] Help modal opens with "?" key
- [x] Help modal opens from sidebar button
- [x] Help modal closes with Escape key
- [x] All tabs in help modal work
- [x] Keyboard shortcuts listed correctly
- [x] FAQ content is accurate
- [x] Getting started guide is clear
- [x] Help icons appear in all locations
- [x] Tooltips show on hover
- [x] Inline hints are dismissible
- [x] Inline hints don't reappear after dismissal
- [x] "What's this?" links work
- [x] All help content is accessible via keyboard
- [x] Dark mode styling works
- [x] Mobile responsive design

## Maintenance

### Adding New Help Content

1. **New FAQ Item:**
   ```tsx
   <FAQItem
     question="Your question?"
     answer="Your detailed answer."
   />
   ```

2. **New Keyboard Shortcut:**
   ```tsx
   <ShortcutItem 
     keys={["Ctrl", "Key"]} 
     description="What it does" 
   />
   ```

3. **New Help Icon:**
   ```tsx
   <HelpIcon 
     content="Explanation text"
     side="right"
   />
   ```

4. **New Inline Hint:**
   ```tsx
   <InlineHint
     id="unique-id"
     title="Hint Title"
     description="Hint description"
   />
   ```

### Updating Help Content

1. Edit `components/help/help-modal.tsx` for modal content
2. Update keyboard shortcuts in both modal and documentation
3. Keep FAQ synchronized with actual features
4. Update getting started guide when onboarding changes

## Dependencies

- `@radix-ui/react-tooltip` - Accessible tooltips
- `@radix-ui/react-tabs` - Tab navigation
- `@radix-ui/react-dialog` - Modal dialogs
- `lucide-react` - Icons (HelpCircle, Lightbulb, X)

## Files Modified

1. `frontend/components/ui/tooltip.tsx` - Created
2. `frontend/components/ui/tabs.tsx` - Created
3. `frontend/components/help/help-modal.tsx` - Created
4. `frontend/components/help/help-icon.tsx` - Created
5. `frontend/components/help/inline-hint.tsx` - Created
6. `frontend/components/help/whats-this-link.tsx` - Created
7. `frontend/components/help/index.ts` - Created
8. `frontend/hooks/use-help-modal.ts` - Created
9. `frontend/components/layout/sidebar.tsx` - Modified
10. `frontend/components/council/execution-mode-selector.tsx` - Modified
11. `frontend/components/council/query-input.tsx` - Modified
12. `frontend/components/council/response-viewer.tsx` - Modified
13. `frontend/components/council/orchestration-breakdown.tsx` - Modified

## Summary

The contextual help system provides comprehensive assistance throughout the application:

- **Help Modal**: Central hub for all help content (shortcuts, FAQ, guide)
- **Help Icons**: Quick tooltips next to complex features
- **Inline Hints**: First-time user guidance
- **What's This Links**: Detailed explanations for complex sections
- **Keyboard Shortcuts**: Efficient navigation and actions

All features are accessible, dismissible, and designed to enhance user experience without being intrusive.
