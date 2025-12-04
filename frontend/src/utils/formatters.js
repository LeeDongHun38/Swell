/**
 * 포맷터 유틸리티
 */

/**
 * 가격 포맷팅
 * @param {number} price - 가격
 * @returns {string} 포맷된 가격 문자열
 */
export function formatPrice(price) {
  if (!price) return '가격 정보 없음';
  return `${price.toLocaleString('ko-KR')}원`;
}

/**
 * 태그 배열을 해시태그 문자열로 변환
 * @param {string[]} tags - 태그 배열
 * @returns {string} 해시태그 문자열
 */
export function formatTags(tags) {
  return tags.map(tag => `#${tag}`).join('  ');
}

