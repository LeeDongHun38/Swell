/**
 * 로컬 스토리지 유틸리티
 */

const STORAGE_KEYS = {
  GENDER: 'swell_gender',
  ACCESS_TOKEN: 'swell_access_token',
};

/**
 * 성별 저장
 */
export function saveGender(gender) {
  localStorage.setItem(STORAGE_KEYS.GENDER, gender);
}

/**
 * 성별 로드
 */
export function loadGender() {
  return localStorage.getItem(STORAGE_KEYS.GENDER);
}

/**
 * 성별 삭제
 */
export function clearGender() {
  localStorage.removeItem(STORAGE_KEYS.GENDER);
}

/**
 * 액세스 토큰 저장
 */
export function saveAccessToken(token) {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
}

/**
 * 액세스 토큰 로드
 */
export function loadAccessToken() {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
}

/**
 * 액세스 토큰 삭제
 */
export function clearAccessToken() {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
}

