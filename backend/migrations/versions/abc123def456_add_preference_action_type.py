"""add_preference_action_type_to_user_coordi_interactions

Revision ID: abc123def456
Revises: edf1720ff21b
Create Date: 2025-01-16 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'abc123def456'
down_revision: Union[str, None] = 'edf1720ff21b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """User_Coordi_Interactions 테이블의 action_type ENUM에 'preference' 추가"""
    
    # PostgreSQL에서 ENUM 타입에 값 추가
    # ENUM 타입 이름: coordi_action_enum
    # 주의: ENUM 값 추가는 트랜잭션 내에서 할 수 없으므로 별도 연결 사용
    
    connection = op.get_bind()
    
    # 먼저 값이 이미 있는지 확인
    check_query = sa.text(
        "SELECT 1 FROM pg_enum "
        "WHERE enumlabel = 'preference' "
        "AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'coordi_action_enum')"
    )
    
    result = connection.execute(check_query).first()
    
    # 값이 없을 때만 추가
    if not result:
        # PostgreSQL에서는 ENUM 값 추가를 트랜잭션 밖에서 실행해야 함
        # autocommit 모드로 별도 연결 생성
        from sqlalchemy import create_engine
        from app.db.database import DATABASE_URL
        
        # autocommit 모드로 새 엔진 생성
        temp_engine = create_engine(DATABASE_URL, isolation_level="AUTOCOMMIT")
        with temp_engine.connect() as temp_conn:
            # ENUM 값 추가 (IF NOT EXISTS는 PostgreSQL 9.1+ 미지원, 이미 체크했으므로 안전)
            temp_conn.execute(
                sa.text("ALTER TYPE coordi_action_enum ADD VALUE 'preference'")
            )
        temp_engine.dispose()


def downgrade() -> None:
    """User_Coordi_Interactions 테이블의 action_type ENUM에서 'preference' 제거"""
    
    # PostgreSQL에서는 ENUM 타입에서 값을 직접 제거할 수 없음
    # 대신 'preference' 값을 가진 데이터를 'like'로 변경
    op.execute(
        sa.text(
            "UPDATE User_Coordi_Interactions "
            "SET action_type = 'like'::coordi_action_enum "
            "WHERE action_type = 'preference'::coordi_action_enum"
        )
    )
    
    # 참고: PostgreSQL에서는 ENUM 값 제거가 복잡하므로
    # 새 ENUM 타입을 만들고 컬럼을 변경해야 함
    # 실제 downgrade가 필요한 경우 별도로 구현 필요

