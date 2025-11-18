"""create_initial_tables

Revision ID: edf1720ff21b
Revises: 
Create Date: 2025-11-16 14:28:22.329507

"""
from typing import Sequence, Union
import sys
from pathlib import Path

from alembic import op
import sqlalchemy as sa

# 프로젝트 루트를 sys.path에 추가
BASE_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(BASE_DIR))

from app.db.database import Base
from app.models import *  # 모든 모델 import


# revision identifiers, used by Alembic.
revision: str = 'edf1720ff21b'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """모든 테이블 생성"""
    # SQLAlchemy 모델을 기반으로 모든 테이블 생성
    # Alembic의 op.get_bind()를 사용하여 현재 연결된 엔진 사용
    Base.metadata.create_all(bind=op.get_bind())


def downgrade() -> None:
    """모든 테이블 삭제"""
    # 모든 테이블 삭제
    Base.metadata.drop_all(bind=op.get_bind())
