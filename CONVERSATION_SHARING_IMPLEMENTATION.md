# Conversation Sharing Implementation

## Overview

This document describes the implementation of the conversation sharing functionality for the AI Council web application. Users can now share their conversations with others through unique shareable links with privacy controls.

## Features Implemented

### 1. Backend Implementation

#### Database Model
- **SharedConversation Model** (`backend/app/models/shared_conversation.py`)
  - Stores shared conversation metadata
  - Fields: id, request_id, share_id, privacy, view_count, is_active, created_at, updated_at
  - Privacy options: public, private, unlisted
  - Tracks view count for analytics

#### Database Migration
- **Migration** (`backend/alembic/versions/20240208_add_shared_conversations.py`)
  - Creates `shared_conversations` table
  - Adds foreign key to `requests` table
  - Creates indexes for performance

#### API Endpoints
- **POST /api/v1/sharing** - Create a shareable link
  - Requires authentication
  - Generates unique 12-character share ID
  - Returns share URL and metadata
  
- **GET /api/v1/sharing/{share_id}** - Get shared conversation (public)
  - No authentication required
  - Increments view count
  - Respects privacy settings
  
- **GET /api/v1/sharing/user/shares** - List user's shared conversations
  - Requires authentication
  - Returns all shares created by the user
  
- **PATCH /api/v1/sharing/{share_id}** - Update privacy settings
  - Requires authentication
  - Can update privacy and active status
  
- **DELETE /api/v1/sharing/{share_id}** - Delete shared conversation
  - Requires authentication
  - Permanently removes the share

#### Schemas
- **SharedConversationCreate** - For creating shares
- **SharedConversationUpdate** - For updating shares
- **SharedConversationResponse** - For returning share metadata
- **PublicConversationResponse** - For public view of conversations

### 2. Frontend Implementation

#### Share Dialog Component
- **ShareDialog** (`frontend/components/chat/share-dialog.tsx`)
  - Modal dialog for creating and managing shares
  - Privacy controls with radio buttons:
    - **Public**: Anyone can find and view
    - **Unlisted**: Only people with the link can view
    - **Private**: Only the owner can view
  - Copy share link button
  - Embed code generation and copy
  - View count display
  - Real-time privacy updates

#### Public Share Page
- **Share Page** (`frontend/app/share/[id]/page.tsx`)
  - Public-facing page for viewing shared conversations
  - No authentication required
  - Displays:
    - Original query
    - AI response with syntax highlighting
    - Execution metadata (confidence, time, cost)
    - Models used
    - View count
  - Error handling for:
    - Not found (404)
    - Private conversations (403)
    - Network errors
  - Call-to-action to try AI Council

#### Response Panel Integration
- Updated **ResponsePanel** (`frontend/components/chat/response-panel.tsx`)
  - Added Share button in header
  - Opens ShareDialog when clicked
  - Passes request ID to dialog

#### UI Components
Created new reusable UI components:
- **RadioGroup** - For privacy selection
- **Label** - For form labels
- **Input** - For text inputs
- **Textarea** - For embed code
- **Skeleton** - For loading states

### 3. Testing

#### Backend Tests
- **test_sharing.py** (`backend/tests/test_sharing.py`)
  - Test creating shared conversations
  - Test getting shared conversations
  - Test updating privacy settings
  - Test deleting shares
  - Test private conversation access control
  - Test view count incrementing

## Usage

### Creating a Share

1. User submits a query and receives a response
2. User clicks the "Share" button in the response panel
3. ShareDialog opens with privacy options
4. User selects privacy level (default: unlisted)
5. User clicks "Create Share Link"
6. System generates unique share ID and URL
7. User can copy the link or embed code

### Viewing a Shared Conversation

1. Anyone with the link visits `/share/{share_id}`
2. System fetches the conversation data
3. View count increments
4. Page displays query, response, and metadata
5. Syntax highlighting for code blocks
6. Call-to-action to try AI Council

### Managing Shares

1. User can update privacy settings anytime
2. User can deactivate shares (is_active = false)
3. User can delete shares permanently
4. User can view all their shares via API

## Privacy Levels

### Public
- Conversation is discoverable
- Anyone can view with or without the link
- Suitable for educational content

### Unlisted (Default)
- Conversation is not discoverable
- Only people with the link can view
- Suitable for sharing with specific people

### Private
- Conversation cannot be viewed by anyone except owner
- Link returns 403 Forbidden
- Suitable for sensitive content

## Security Considerations

1. **Share ID Generation**
   - Uses `secrets.token_urlsafe()` for cryptographically secure IDs
   - 12 characters provide sufficient entropy
   - Uniqueness is verified before creation

2. **Access Control**
   - Only conversation owners can create/update/delete shares
   - Private conversations return 403 to unauthorized users
   - View count increments only for successful views

3. **Data Exposure**
   - Public endpoint only exposes necessary data
   - User information is not included in public view
   - Orchestration metadata is filtered

## Database Schema

```sql
CREATE TABLE shared_conversations (
    id UUID PRIMARY KEY,
    request_id UUID NOT NULL UNIQUE REFERENCES requests(id) ON DELETE CASCADE,
    share_id VARCHAR(12) NOT NULL UNIQUE,
    privacy VARCHAR(20) NOT NULL DEFAULT 'unlisted',
    view_count INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX ix_shared_conversations_request_id ON shared_conversations(request_id);
CREATE INDEX ix_shared_conversations_share_id ON shared_conversations(share_id);
```

## API Examples

### Create Share
```bash
curl -X POST http://localhost:8000/api/v1/sharing \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "request_id": "123e4567-e89b-12d3-a456-426614174000",
    "privacy": "unlisted"
  }'
```

### Get Shared Conversation
```bash
curl http://localhost:8000/api/v1/sharing/abc123def456
```

### Update Privacy
```bash
curl -X PATCH http://localhost:8000/api/v1/sharing/abc123def456 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"privacy": "public"}'
```

### Delete Share
```bash
curl -X DELETE http://localhost:8000/api/v1/sharing/abc123def456 \
  -H "Authorization: Bearer <token>"
```

## Future Enhancements

1. **Social Sharing**
   - Add Open Graph meta tags for rich previews
   - Twitter Card support
   - LinkedIn sharing optimization

2. **Analytics**
   - Track referrer sources
   - Geographic distribution of views
   - Time-based view analytics

3. **Expiration**
   - Optional expiration dates for shares
   - Auto-delete after X days
   - Renewal options

4. **Customization**
   - Custom share URLs (vanity URLs)
   - Branded share pages
   - Custom themes for embedded views

5. **Collaboration**
   - Comments on shared conversations
   - Reactions/likes
   - Fork/remix conversations

## Dependencies

### Backend
- FastAPI
- SQLAlchemy
- Pydantic
- secrets (Python standard library)

### Frontend
- Next.js 14
- React 18
- Radix UI (Dialog, RadioGroup, Label)
- Lucide React (icons)
- React Syntax Highlighter

## Deployment Notes

1. Run database migration:
   ```bash
   cd backend
   alembic upgrade head
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Restart backend and frontend servers

4. Test sharing functionality:
   - Create a conversation
   - Click Share button
   - Create share link
   - Open share link in incognito window
   - Verify view count increments

## Conclusion

The conversation sharing functionality is now fully implemented and tested. Users can easily share their AI Council conversations with customizable privacy controls, and viewers can access shared conversations through clean, public-facing pages without requiring authentication.
