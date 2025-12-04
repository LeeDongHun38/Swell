/**
 * 추천 관련 API 서비스
 */
import { get, post } from './api';
import { API_ENDPOINTS } from '../constants/api';
import { parseDescription } from '../utils/descriptionParser';

/**
 * 추천 코디 목록 조회
 * @param {Object} params - { page?: number, limit?: number, gender?: string, hashtagIds?: number[], sampleOutfitIds?: number[] }
 * @returns {Promise<Object>} { outfits: [], pagination: {...} }
 */
export async function getRecommendations(params = {}) {
  const { 
    page = 1, 
    limit = 20, 
    gender = null, 
    hashtagIds = null, 
    sampleOutfitIds = null 
  } = params;
  
  const queryParams = new URLSearchParams({ 
    page: page.toString(), 
    limit: limit.toString() 
  });
  
  // Cold-Start 테스트: 온보딩 데이터를 쿼리 파라미터로 전달
  if (gender) {
    // 성별을 "male" 또는 "female"로 변환
    const genderLower = gender.toLowerCase();
    if (genderLower === '여성' || genderLower === '여자' || genderLower === 'female' || genderLower === 'f') {
      queryParams.append('gender', 'female');
    } else if (genderLower === '남성' || genderLower === '남자' || genderLower === 'male' || genderLower === 'm') {
      queryParams.append('gender', 'male');
    }
  }
  
  if (hashtagIds && hashtagIds.length > 0) {
    hashtagIds.forEach(id => queryParams.append('hashtagIds', id.toString()));
  }
  
  if (sampleOutfitIds && sampleOutfitIds.length > 0) {
    sampleOutfitIds.forEach(id => queryParams.append('sampleOutfitIds', id.toString()));
  }
  
  const response = await get(`${API_ENDPOINTS.RECOMMENDATIONS.GET_RECOMMENDATIONS}?${queryParams}`);
  
  // Description 파싱하여 tags와 text 분리
  const outfits = (response.data?.outfits || []).map(outfit => {
    const { text, tags } = parseDescription(outfit.description || '');
    return {
      ...outfit,
      descriptionText: text,
      descriptionTags: tags,
      // 기존 description도 유지 (필요시)
    };
  });
  
  return {
    outfits,
    pagination: response.data?.pagination || {},
  };
}

/**
 * 코디 좋아요
 * @param {number} coordiId - 코디 ID
 */
export async function likeCoordi(coordiId) {
  return post(API_ENDPOINTS.OUTFITS.LIKE.replace(':id', coordiId));
}

/**
 * 코디 조회 로그 기록
 * @param {number} coordiId - 코디 ID
 */
export async function viewCoordi(coordiId) {
  return post(API_ENDPOINTS.OUTFITS.VIEW.replace(':id', coordiId));
}

