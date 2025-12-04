/**
 * 온보딩 관련 API 서비스
 */
import { get, post } from './api';
import { API_ENDPOINTS } from '../constants/api';

/**
 * 선호도 설정 옵션 조회 (태그 및 샘플 코디)
 * @param {string} gender - 성별 ("MALE", "FEMALE", "여성", "남성" 또는 null)
 * @returns {Promise<Object>} { hashtags: [], sampleOutfits: [] }
 */
export async function getPreferencesOptions(gender = null) {
  console.log('🔍 [onboardingService] getPreferencesOptions 호출:', { gender });
  
  const params = new URLSearchParams();
  if (gender) {
    // 성별을 "male" 또는 "female"로 변환
    // "여성" -> "female", "남성" -> "male"
    const genderLower = gender.toLowerCase();
    if (genderLower === '여성' || genderLower === '여자' || genderLower === 'female' || genderLower === 'f') {
      params.append('gender', 'female');
    } else if (genderLower === '남성' || genderLower === '남자' || genderLower === 'male' || genderLower === 'm') {
      params.append('gender', 'male');
    }
  }
  
  const endpoint = `${API_ENDPOINTS.ONBOARDING.GET_PREFERENCES_OPTIONS}${params.toString() ? '?' + params.toString() : ''}`;
  console.log('🔍 [onboardingService] API 요청:', { endpoint, params: params.toString() });
  
  const response = await get(endpoint);
  console.log('🔍 [onboardingService] API 응답:', { 
    hashtagsCount: response.data?.hashtags?.length || 0, 
    sampleOutfitsCount: response.data?.sampleOutfits?.length || 0,
    sampleOutfits: response.data?.sampleOutfits?.map(o => ({ id: o.id, type: typeof o.id })) || []
  });
  
  return response.data; // { hashtags: [], sampleOutfits: [] }
}

/**
 * 온보딩 선호사항 제출
 * @param {Object} data - { hashtagIds: number[], sampleOutfitIds: number[] }
 * @returns {Promise<Object>} { success: boolean, data: { message: string, user: {...} } }
 */
export async function submitPreferences(data) {
  const response = await post(API_ENDPOINTS.ONBOARDING.SUBMIT_PREFERENCES, {
    hashtagIds: data.hashtagIds || [],
    sampleOutfitIds: data.sampleOutfitIds || [],
  });
  return response.data; // { message: string, user: {...} }
}

