/**
 * 유효성 검사 유틸리티
 */

/**
 * 태그 선택 유효성 검사
 * @param {string[]} selectedTags - 선택된 태그 배열
 * @param {number} min - 최소 개수
 * @param {number} max - 최대 개수
 * @returns {Object} { isValid: boolean, message: string }
 */
export function validateTags(selectedTags, min = 3, max = 10) {
  const count = selectedTags.length;
  
  if (count < min) {
    return {
      isValid: false,
      message: `${min - count}개 더 선택해주세요 (현재 ${count}개)`,
    };
  }
  
  if (count > max) {
    return {
      isValid: false,
      message: `최대 ${max}개까지만 선택할 수 있습니다.`,
    };
  }
  
  return {
    isValid: true,
    message: `좋아요! (현재 ${count}개 선택됨)`,
  };
}

/**
 * 코디 선택 유효성 검사
 * @param {number[]} selectedOutfits - 선택된 코디 ID 배열
 * @param {number} required - 필수 개수
 * @returns {Object} { isValid: boolean, message: string }
 */
export function validateOutfits(selectedOutfits, required = 5) {
  const count = selectedOutfits.length;
  
  if (count !== required) {
    return {
      isValid: false,
      message: `정확히 ${required}개의 코디를 선택해주세요. (현재 ${count}/${required})`,
    };
  }
  
  return {
    isValid: true,
    message: `${required}개 선택 완료`,
  };
}

