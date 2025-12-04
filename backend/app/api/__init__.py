from fastapi import APIRouter

from app.api.outfits import router as outfits_router
from app.api.recommendations import router as recommendations_router
from app.api.users import router as users_router

api_router = APIRouter()

# 사용자 관련 라우터
api_router.include_router(users_router)

# 코디 추천 관련 라우터
api_router.include_router(recommendations_router)

# 코디 목록 조회 관련 라우터
api_router.include_router(outfits_router)

__all__ = ["api_router"]


