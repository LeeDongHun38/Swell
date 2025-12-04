"""
코디 목록 조회 관련 API 라우터.
"""

from __future__ import annotations

from typing import Literal

from fastapi import APIRouter, Depends, Header, Query, status
from sqlalchemy.orm import Session

from app.core.security import extract_bearer_token
from app.db.database import get_db
from app.schemas.outfits import (
    AddFavoriteResponse,
    AddFavoriteResponseData,
    RecordViewLogRequest,
    RecordViewLogResponse,
    RecordViewLogResponseData,
)
from app.services.auth_service import get_user_from_token
from app.services.outfits_service import (
    add_favorite,
    record_view_log,
)

# 코디 목록 조회 관련 라우터(접두사: /outfits)
router = APIRouter(prefix="/outfits", tags=["Outfits"])

@router.post(
    "/{outfit_id}/view",
    status_code=status.HTTP_200_OK,
    response_model=RecordViewLogResponse,
)
async def record_view_log_endpoint(
    outfit_id: int,
    request: RecordViewLogRequest,
    authorization: str = Header(...),
    db: Session = Depends(get_db),
) -> RecordViewLogResponse:
    """
    코디 조회 로그를 기록합니다.
    
    같은 코디를 여러 번 볼 수 있으며, 각 조회 세션마다 새로운 레코드가 생성됩니다.
    """
    # 헤더에서 토큰 추출
    token = extract_bearer_token(authorization)
    
    # 토큰 검증 및 사용자 조회
    user = get_user_from_token(db, token)
    
    # 조회 로그 기록
    recorded_at = record_view_log(
        db=db,
        user_id=user.user_id,
        coordi_id=outfit_id,
        duration_seconds=request.duration_seconds,
    )
    
    # 응답 반환
    return RecordViewLogResponse(
        data=RecordViewLogResponseData(
            message="조회 로그가 기록되었습니다",
            recordedAt=recorded_at,
        )
    )


@router.post(
    "/{outfit_id}/favorite",
    status_code=status.HTTP_200_OK,
    response_model=AddFavoriteResponse,
)
async def add_favorite_endpoint(
    outfit_id: int,
    authorization: str = Header(...),
    db: Session = Depends(get_db),
) -> AddFavoriteResponse:
    """
    코디에 좋아요를 추가합니다.
    
    이미 좋아요한 코디에 다시 좋아요를 추가할 수 없습니다.
    """
    # 헤더에서 토큰 추출
    token = extract_bearer_token(authorization)
    
    # 토큰 검증 및 사용자 조회
    user = get_user_from_token(db, token)
    
    # 좋아요 추가
    interaction = add_favorite(
        db=db,
        user_id=user.user_id,
        coordi_id=outfit_id,
    )
    
    # 응답 반환
    return AddFavoriteResponse(
        data=AddFavoriteResponseData(
            outfitId=interaction.coordi_id,
            isFavorited=True,
            favoritedAt=interaction.interacted_at,
        )
    )

