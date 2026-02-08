"""Shared conversation model."""
from datetime import datetime
from typing import Optional
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, String, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class SharedConversation(Base):
    """Shared conversation model for public sharing."""

    __tablename__ = "shared_conversations"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    request_id: Mapped[UUID] = mapped_column(
        ForeignKey("requests.id", ondelete="CASCADE"), nullable=False, unique=True, index=True
    )
    share_id: Mapped[str] = mapped_column(String(12), nullable=False, unique=True, index=True)
    privacy: Mapped[str] = mapped_column(
        String(20), nullable=False, default="unlisted"
    )  # public, private, unlisted
    view_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    request: Mapped["Request"] = relationship("Request")

    def __repr__(self) -> str:
        return f"<SharedConversation(id={self.id}, share_id={self.share_id}, privacy={self.privacy})>"
