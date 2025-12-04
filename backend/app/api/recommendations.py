"""
코디 추천 관련 API 라우터.
"""

from __future__ import annotations

import logging
from typing import Optional, List

from fastapi import APIRouter, Depends, Header, Query, status
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

from app.core.security import extract_bearer_token
from app.db.database import get_db
from app.schemas.recommendation_response import (
    RecommendationsResponse,
    RecommendationsResponseData,
)
from app.services.auth_service import get_user_from_token
from app.services.recommendations_service import get_recommended_coordis

# 코디 추천 관련 라우터(접두사: /recommendations)
router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

# 코디 추천 조회 API
@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=RecommendationsResponse,
)
async def get_recommendations(
    page: int = Query(default=1, ge=1, description="페이지 번호"),
    limit: int = Query(default=20, ge=1, le=50, description="페이지당 개수"),
    gender: Optional[str] = Query(None, description="성별 (male/female) - Cold-Start 테스트용"),
    hashtagIds: Optional[List[str]] = Query(None, description="선호 태그 ID 배열 - Cold-Start 테스트용"),
    sampleOutfitIds: Optional[List[str]] = Query(None, description="선호 코디 ID 배열 - Cold-Start 테스트용"),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
) -> RecommendationsResponse:
    """
    사용자 맞춤 코디 목록을 조회합니다.
    
    사용자 성별에 맞는 코디를 추천 알고리즘 기반으로 반환합니다.
    각 코디에는 LLM이 생성한 개인화된 메시지가 포함됩니다.
    
    Cold-Start 테스트: 인증 없이 쿼리 파라미터로 온보딩 데이터를 전달할 수 있습니다.
    """
    user_id = None
    user_gender = None
    
    # 인증이 있으면 사용자 정보 조회
    if authorization:
        try:
            token = extract_bearer_token(authorization)
            user = get_user_from_token(db, token)
            user_id = user.user_id
            user_gender = user.gender
        except Exception:
            # 인증 실패 시 쿼리 파라미터 사용
            pass
    
    # 쿼리 파라미터에서 온보딩 데이터 사용 (Cold-Start 테스트)
    # JavaScript Number 정밀도 손실 방지: 문자열로 받아서 int로 변환
    onboarding_gender = gender
    onboarding_hashtag_ids = [int(id) for id in (hashtagIds or [])] if hashtagIds else []
    onboarding_sample_outfit_ids = [int(id) for id in (sampleOutfitIds or [])] if sampleOutfitIds else []
    
    # gender 형식 변환
    if onboarding_gender:
        onboarding_gender_lower = onboarding_gender.lower()
        if onboarding_gender_lower in ["male", "m", "남성", "남자"]:
            onboarding_gender = "male"
        elif onboarding_gender_lower in ["female", "f", "여성", "여자"]:
            onboarding_gender = "female"
        else:
            onboarding_gender = None
    
    # 추천 코디 조회
    outfits, pagination = await get_recommended_coordis(
        db=db,
        user_id=user_id,
        page=page,
        limit=limit,
        onboarding_gender=onboarding_gender,
        onboarding_hashtag_ids=onboarding_hashtag_ids,
        onboarding_sample_outfit_ids=onboarding_sample_outfit_ids,
    )
    
    # 응답 반환
    return RecommendationsResponse(
        data=RecommendationsResponseData(
            outfits=outfits,
            pagination=pagination,
        )
    )

