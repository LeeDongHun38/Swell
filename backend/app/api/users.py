"""
사용자 관련 API 라우터.
"""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, File, Header, Query, status, UploadFile
from sqlalchemy.orm import Session

from app.core.security import decode_access_token, extract_bearer_token
from app.db.database import get_db
from app.schemas.users import (
    PreferencesOptionsResponse,
    PreferencesOptionsResponseData,
    PreferencesResponse,
    PreferencesResponseData,
    PreferencesResponseUser,
    UserPreferencesRequest,
)
from app.services.auth_service import get_user_from_token
from app.services.users_service import (
    get_preferences_options_data,
    set_user_preferences,
    validate_preferences,
)

# 사용자 관련 라우터(접두사: /users)
router = APIRouter(prefix="/users", tags=["Users"])


# 사용자 선호도 설정 옵션 제공 API
@router.get(
    "/preferences/options",
    status_code=status.HTTP_200_OK,
    response_model=PreferencesOptionsResponse,
)
def get_preferences_options(
    gender: Optional[str] = Query(None, description="성별 (male/female)"),  # 쿼리 파라미터로 성별 받기
    authorization: Optional[str] = Header(None),  # Optional로 변경
    db: Session = Depends(get_db),
) -> PreferencesOptionsResponse:
    """사용자 선호도 설정 옵션 제공 엔드포인트."""

    # 인증이 있으면 사용자 정보에서 gender 가져오기
    final_gender = None
    if authorization:
        try:
            token = extract_bearer_token(authorization)
            user = get_user_from_token(db, token)
            # 사용자 gender를 우선 사용 (쿼리 파라미터보다 우선)
            if user.gender:
                final_gender = user.gender.lower()
        except Exception:
            # 인증 실패 시 쿼리 파라미터 사용
            pass
    
    # 쿼리 파라미터의 gender 사용 (인증이 없거나 사용자 gender가 없는 경우)
    if not final_gender and gender:
        final_gender = gender.lower()
    
    # gender를 "male"/"female" 형식으로 변환
    if final_gender:
        if final_gender in ["male", "m", "남성", "남자"]:
            final_gender = "male"
        elif final_gender in ["female", "f", "여성", "여자"]:
            final_gender = "female"
        else:
            final_gender = None

    # 선호도 설정 옵션 데이터 조회
    hashtags, sample_outfits = get_preferences_options_data(db, final_gender)

    # 응답 반환
    return PreferencesOptionsResponse(
        data=PreferencesOptionsResponseData(
            hashtags=hashtags,
            sampleOutfits=sample_outfits,
        )
    )


# 사용자 선호도 설정 API
@router.post(
    "/preferences",
    status_code=status.HTTP_200_OK,
    response_model=PreferencesResponse,
)
def set_preferences(
    payload: UserPreferencesRequest,
    authorization: Optional[str] = Header(None),  # 인증 헤더 (선택적)
    db: Session = Depends(get_db),
) -> PreferencesResponse:
    """사용자 선호도 설정 엔드포인트.
    
    인증이 있으면 DB에 저장하고, 없으면 검증만 수행합니다 (Cold-Start 테스트용).
    """

    # 인증이 있으면 DB에 저장
    if authorization:
        try:
            # 헤더에서 토큰 추출
            token = extract_bearer_token(authorization)

            # 토큰 검증 및 사용자 조회
            user = get_user_from_token(db, token)

            # 선호도 설정 (DB에 저장)
            updated_user = set_user_preferences(db, user.user_id, payload)

            # 응답 반환
            return PreferencesResponse(
                data=PreferencesResponseData(
                    message="선호도가 저장되었습니다",
                    user=PreferencesResponseUser(
                        id=updated_user.user_id,
                        hasCompletedOnboarding=updated_user.has_completed_onboarding,
                    ),
                )
            )
        except Exception:
            # 인증 실패 시 검증만 수행하도록 fallback
            pass

    # 인증이 없거나 실패한 경우: 검증만 수행
    validate_preferences(db, payload)

    # 응답 반환 (저장하지 않음)
    return PreferencesResponse(
        data=PreferencesResponseData(
            message="선호도가 검증되었습니다",
            user=PreferencesResponseUser(
                id=0,  # 인증 없을 때는 임시 값 사용
                hasCompletedOnboarding=False,  # 저장하지 않았으므로 False
            ),
        )
    )




