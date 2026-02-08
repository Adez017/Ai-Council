"""Tests for sharing functionality."""
import pytest
from uuid import uuid4
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.request import Request
from app.models.response import Response
from app.models.shared_conversation import SharedConversation


@pytest.mark.asyncio
async def test_create_shared_conversation(
    client: AsyncClient,
    test_user: User,
    auth_headers: dict,
    db_session: AsyncSession,
):
    """Test creating a shared conversation."""
    # Create a request and response
    request = Request(
        id=uuid4(),
        user_id=test_user.id,
        content="Test query",
        execution_mode="balanced",
        status="completed",
    )
    db_session.add(request)
    
    response = Response(
        id=uuid4(),
        request_id=request.id,
        content="Test response",
        confidence=0.95,
        total_cost=0.01,
        execution_time=5.0,
        models_used={"models": ["test-model"]},
        orchestration_metadata={},
    )
    db_session.add(response)
    await db_session.commit()
    
    # Create share
    response = await client.post(
        "/api/v1/sharing",
        json={
            "request_id": str(request.id),
            "privacy": "unlisted",
        },
        headers=auth_headers,
    )
    
    assert response.status_code == 201
    data = response.json()
    assert "share_id" in data
    assert data["privacy"] == "unlisted"
    assert data["view_count"] == 0
    assert data["is_active"] is True


@pytest.mark.asyncio
async def test_get_shared_conversation(
    client: AsyncClient,
    test_user: User,
    auth_headers: dict,
    db_session: AsyncSession,
):
    """Test getting a shared conversation."""
    # Create a request, response, and share
    request = Request(
        id=uuid4(),
        user_id=test_user.id,
        content="Test query",
        execution_mode="balanced",
        status="completed",
    )
    db_session.add(request)
    
    response = Response(
        id=uuid4(),
        request_id=request.id,
        content="Test response",
        confidence=0.95,
        total_cost=0.01,
        execution_time=5.0,
        models_used={"models": ["test-model"]},
        orchestration_metadata={},
    )
    db_session.add(response)
    
    shared = SharedConversation(
        id=uuid4(),
        request_id=request.id,
        share_id="test123",
        privacy="unlisted",
    )
    db_session.add(shared)
    await db_session.commit()
    
    # Get shared conversation (no auth required)
    response = await client.get(f"/api/v1/sharing/test123")
    
    assert response.status_code == 200
    data = response.json()
    assert data["share_id"] == "test123"
    assert data["content"] == "Test query"
    assert data["response_content"] == "Test response"
    assert data["view_count"] == 1  # Should increment


@pytest.mark.asyncio
async def test_update_shared_conversation_privacy(
    client: AsyncClient,
    test_user: User,
    auth_headers: dict,
    db_session: AsyncSession,
):
    """Test updating shared conversation privacy."""
    # Create a request, response, and share
    request = Request(
        id=uuid4(),
        user_id=test_user.id,
        content="Test query",
        execution_mode="balanced",
        status="completed",
    )
    db_session.add(request)
    
    response = Response(
        id=uuid4(),
        request_id=request.id,
        content="Test response",
        confidence=0.95,
        total_cost=0.01,
        execution_time=5.0,
        models_used={"models": ["test-model"]},
        orchestration_metadata={},
    )
    db_session.add(response)
    
    shared = SharedConversation(
        id=uuid4(),
        request_id=request.id,
        share_id="test456",
        privacy="unlisted",
    )
    db_session.add(shared)
    await db_session.commit()
    
    # Update privacy
    response = await client.patch(
        f"/api/v1/sharing/test456",
        json={"privacy": "public"},
        headers=auth_headers,
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["privacy"] == "public"


@pytest.mark.asyncio
async def test_delete_shared_conversation(
    client: AsyncClient,
    test_user: User,
    auth_headers: dict,
    db_session: AsyncSession,
):
    """Test deleting a shared conversation."""
    # Create a request, response, and share
    request = Request(
        id=uuid4(),
        user_id=test_user.id,
        content="Test query",
        execution_mode="balanced",
        status="completed",
    )
    db_session.add(request)
    
    response = Response(
        id=uuid4(),
        request_id=request.id,
        content="Test response",
        confidence=0.95,
        total_cost=0.01,
        execution_time=5.0,
        models_used={"models": ["test-model"]},
        orchestration_metadata={},
    )
    db_session.add(response)
    
    shared = SharedConversation(
        id=uuid4(),
        request_id=request.id,
        share_id="test789",
        privacy="unlisted",
    )
    db_session.add(shared)
    await db_session.commit()
    
    # Delete share
    response = await client.delete(
        f"/api/v1/sharing/test789",
        headers=auth_headers,
    )
    
    assert response.status_code == 204
    
    # Verify it's deleted
    response = await client.get(f"/api/v1/sharing/test789")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_private_conversation_not_accessible(
    client: AsyncClient,
    test_user: User,
    auth_headers: dict,
    db_session: AsyncSession,
):
    """Test that private conversations cannot be accessed publicly."""
    # Create a request, response, and private share
    request = Request(
        id=uuid4(),
        user_id=test_user.id,
        content="Test query",
        execution_mode="balanced",
        status="completed",
    )
    db_session.add(request)
    
    response = Response(
        id=uuid4(),
        request_id=request.id,
        content="Test response",
        confidence=0.95,
        total_cost=0.01,
        execution_time=5.0,
        models_used={"models": ["test-model"]},
        orchestration_metadata={},
    )
    db_session.add(response)
    
    shared = SharedConversation(
        id=uuid4(),
        request_id=request.id,
        share_id="private123",
        privacy="private",
    )
    db_session.add(shared)
    await db_session.commit()
    
    # Try to access private conversation
    response = await client.get(f"/api/v1/sharing/private123")
    
    assert response.status_code == 403
