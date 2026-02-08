"""Add shared conversations table

Revision ID: 20240208_shared_conversations
Revises: 20240101_0000_initial_schema
Create Date: 2024-02-08 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '20240208_shared_conversations'
down_revision = '20240101_0000_initial_schema'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create shared_conversations table
    op.create_table(
        'shared_conversations',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('request_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('share_id', sa.String(12), nullable=False),
        sa.Column('privacy', sa.String(20), nullable=False, server_default='unlisted'),
        sa.Column('view_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False, server_default=sa.text('now()')),
        sa.ForeignKeyConstraint(['request_id'], ['requests.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('request_id'),
        sa.UniqueConstraint('share_id'),
    )
    
    # Create indexes
    op.create_index('ix_shared_conversations_request_id', 'shared_conversations', ['request_id'])
    op.create_index('ix_shared_conversations_share_id', 'shared_conversations', ['share_id'])


def downgrade() -> None:
    op.drop_index('ix_shared_conversations_share_id', table_name='shared_conversations')
    op.drop_index('ix_shared_conversations_request_id', table_name='shared_conversations')
    op.drop_table('shared_conversations')
