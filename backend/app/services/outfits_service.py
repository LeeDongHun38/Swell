"""
코디 목록 조회 관련 비즈니스 로직.
"""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.exceptions import AlreadyFavoritedError, OutfitNotFoundError
from app.models.coordi import Coordi
from app.models.user_coordi_interaction import UserCoordiInteraction
from app.models.user_coordi_view_log import UserCoordiViewLog

def add_favorite(
    db: Session,
    user_id: int,
    coordi_id: int,
) -> UserCoordiInteraction:
    """
    코디에 좋아요를 추가합니다.
    
    Parameters
    ----------
    db:
        데이터베이스 세션
    user_id:
        사용자 ID
    coordi_id:
        코디 ID
        
    Returns
    -------
    UserCoordiInteraction:
        생성된 좋아요 상호작용 레코드
        
    Raises
    ------
    OutfitNotFoundError:
        코디가 존재하지 않는 경우
    AlreadyFavoritedError:
        이미 좋아요한 코디인 경우
    """
    # 1. 코디 존재 여부 확인
    coordi = db.get(Coordi, coordi_id)
    if coordi is None:
        raise OutfitNotFoundError()
    
    # 2. 이미 좋아요가 있는지 확인
    existing_like = db.execute(
        select(UserCoordiInteraction)
        .where(
            UserCoordiInteraction.user_id == user_id,
            UserCoordiInteraction.coordi_id == coordi_id,
            UserCoordiInteraction.action_type == "like",
        )
    ).scalar_one_or_none()
    
    if existing_like is not None:
        raise AlreadyFavoritedError()
    
    # 3. 기존 상호작용 확인 (skip 등 다른 action_type이 있는 경우)
    existing_interaction = db.execute(
        select(UserCoordiInteraction)
        .where(
            UserCoordiInteraction.user_id == user_id,
            UserCoordiInteraction.coordi_id == coordi_id,
        )
    ).scalar_one_or_none()
    
    if existing_interaction is not None:
        # 기존 상호작용이 있으면 좋아요로 업데이트 (좋아요 우선)
        existing_interaction.action_type = "like"
        db.commit()
        db.refresh(existing_interaction)
        return existing_interaction
    
    # 4. 새로운 좋아요 기록 생성
    interaction = UserCoordiInteraction(
        user_id=user_id,
        coordi_id=coordi_id,
        action_type="like",
    )
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    
    return interaction


def record_view_log(
    db: Session,
    user_id: int,
    coordi_id: int,
    duration_seconds: int,
) -> datetime:
    """
    코디 조회 로그를 기록합니다.
    
    Parameters
    ----------
    db:
        데이터베이스 세션
    user_id:
        사용자 ID
    coordi_id:
        코디 ID
    duration_seconds:
        조회 시간 (초)
        
    Returns
    -------
    datetime:
        기록 일시 (UTC)
        
    Raises
    ------
    OutfitNotFoundError:
        코디가 존재하지 않는 경우
    """
    # 1. 코디 존재 여부 확인
    coordi = db.get(Coordi, coordi_id)
    if coordi is None:
        raise OutfitNotFoundError()
    
    # 2. 조회 로그 레코드 생성
    view_log = UserCoordiViewLog(
        user_id=user_id,
        coordi_id=coordi_id,
        duration_seconds=duration_seconds,
    )
    db.add(view_log)
    db.commit()
    db.refresh(view_log)
    
    # 3. 기록 일시 반환 (view_started_at 사용)
    return view_log.view_started_at

