"""Sharing API endpoints."""
import secrets
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.schemas.shared_conversation import (
    SharedConversationCreate,
    SharedConversationResponse,
    SharedConversationUpdate,
    PublicConversationResponse,
)
from app.core.database import get_db
from app.core.middleware import get_current_user
from app.models.request import Request
from app.models.response import Response
from app.models.shared_conversation import SharedConversation
from app.models.user import User

router = APIRouter(prefix="/api/v1/sharing", tags=["sharing"])


def generate_share_id() -> str:
    """Generate a unique 12-character share ID."""
    return secrets.token_urlsafe(9)[:12]


@router.post("", response_model=SharedConversationResponse, status_code=status.HTTP_201_CREATED)
async def create_shared_conversation(
    data: SharedConversationCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a shareable link for a conversation."""
    # Verify the request belongs to the current user
    result = await db.execute(
        select(Request).where(
            Request.id == data.request_id,
            Request.user_id == current_user.id
        )
    )
    request = result.scalar_one_or_none()
    
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found or you don't have permission to share it"
        )
    
    # Check if already shared
    result = await db.execute(
        select(SharedConversation).where(
            SharedConversation.request_id == data.request_id
        )
    )
    existing_share = result.scalar_one_or_none()
    
    if existing_share:
        # Return existing share
        existing_share.privacy = data.privacy
        existing_share.is_active = True
        await db.commit()
        await db.refresh(existing_share)
        
        return SharedConversationResponse(
            **existing_share.__dict__,
            share_url=f"/share/{existing_share.share_id}"
        )
    
    # Create new shared conversation
    share_id = generate_share_id()
    
    # Ensure uniqueness
    while True:
        result = await db.execute(
            select(SharedConversation).where(SharedConversation.share_id == share_id)
        )
        if not result.scalar_one_or_none():
            break
        share_id = generate_share_id()
    
    shared_conversation = SharedConversation(
        request_id=data.request_id,
        share_id=share_id,
        privacy=data.privacy,
    )
    
    db.add(shared_conversation)
    await db.commit()
    await db.refresh(shared_conversation)
    
    return SharedConversationResponse(
        **shared_conversation.__dict__,
        share_url=f"/share/{shared_conversation.share_id}"
    )


@router.get("/{share_id}", response_model=PublicConversationResponse)
async def get_shared_conversation(
    share_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get a shared conversation by share ID (public endpoint)."""
    # Find the shared conversation
    result = await db.execute(
        select(SharedConversation)
        .options(selectinload(SharedConversation.request))
        .where(
            SharedConversation.share_id == share_id,
            SharedConversation.is_active == True
        )
    )
    shared_conversation = result.scalar_one_or_none()
    
    if not shared_conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shared conversation not found or has been disabled"
        )
    
    # Check privacy settings
    if shared_conversation.privacy == "private":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This conversation is private"
        )
    
    # Get the request and response
    request = shared_conversation.request
    
    result = await db.execute(
        select(Response).where(Response.request_id == request.id)
    )
    response = result.scalar_one_or_none()
    
    if not response:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Response not found for this conversation"
        )
    
    # Increment view count
    shared_conversation.view_count += 1
    await db.commit()
    
    return PublicConversationResponse(
        share_id=shared_conversation.share_id,
        content=request.content,
        response_content=response.content,
        confidence=response.confidence,
        execution_time=response.execution_time,
        total_cost=response.total_cost,
        models_used=response.models_used.get("models", []) if isinstance(response.models_used, dict) else [],
        execution_mode=request.execution_mode,
        created_at=request.created_at,
        view_count=shared_conversation.view_count,
    )


@router.get("/user/shares", response_model=list[SharedConversationResponse])
async def get_user_shared_conversations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get all shared conversations for the current user."""
    result = await db.execute(
        select(SharedConversation)
        .join(Request)
        .where(Request.user_id == current_user.id)
        .order_by(SharedConversation.created_at.desc())
    )
    shared_conversations = result.scalars().all()
    
    return [
        SharedConversationResponse(
            **sc.__dict__,
            share_url=f"/share/{sc.share_id}"
        )
        for sc in shared_conversations
    ]


@router.patch("/{share_id}", response_model=SharedConversationResponse)
async def update_shared_conversation(
    share_id: str,
    data: SharedConversationUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a shared conversation's settings."""
    # Find the shared conversation and verify ownership
    result = await db.execute(
        select(SharedConversation)
        .join(Request)
        .where(
            SharedConversation.share_id == share_id,
            Request.user_id == current_user.id
        )
    )
    shared_conversation = result.scalar_one_or_none()
    
    if not shared_conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shared conversation not found or you don't have permission to update it"
        )
    
    # Update fields
    if data.privacy is not None:
        shared_conversation.privacy = data.privacy
    if data.is_active is not None:
        shared_conversation.is_active = data.is_active
    
    await db.commit()
    await db.refresh(shared_conversation)
    
    return SharedConversationResponse(
        **shared_conversation.__dict__,
        share_url=f"/share/{shared_conversation.share_id}"
    )


@router.delete("/{share_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_shared_conversation(
    share_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a shared conversation."""
    # Find the shared conversation and verify ownership
    result = await db.execute(
        select(SharedConversation)
        .join(Request)
        .where(
            SharedConversation.share_id == share_id,
            Request.user_id == current_user.id
        )
    )
    shared_conversation = result.scalar_one_or_none()
    
    if not shared_conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shared conversation not found or you don't have permission to delete it"
        )
    
    await db.delete(shared_conversation)
    await db.commit()
