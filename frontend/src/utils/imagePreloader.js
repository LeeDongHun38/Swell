/**
 * 이미지 Preloading 유틸리티 함수
 * 추천 목록의 이미지를 미리 로드하여 빠른 전환을 지원합니다.
 */

/**
 * 단일 이미지를 preload합니다.
 * @param {string} url - 이미지 URL
 * @returns {Promise<Image>} 로드된 이미지 객체
 */
export function preloadImage(url) {
  if (!url) {
    return Promise.reject(new Error('Image URL is required'));
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
    img.src = url;
  });
}

/**
 * 하나의 추천에 포함된 모든 이미지를 preload합니다.
 * (메인 이미지 + 모든 아이템 이미지)
 * @param {Object} recommendation - 추천 객체
 * @returns {Promise<PromiseSettledResult[]>} 모든 이미지 preload 결과
 */
export async function preloadRecommendationImages(recommendation) {
  if (!recommendation) {
    return Promise.resolve([]);
  }

  const promises = [];

  // 메인 이미지 preload
  const mainImageUrl = recommendation.imageUrl || recommendation.image;
  if (mainImageUrl) {
    promises.push(preloadImage(mainImageUrl));
  }

  // 아이템 이미지들 preload
  if (recommendation.items && Array.isArray(recommendation.items)) {
    recommendation.items.forEach((item) => {
      const itemImageUrl = item.imageUrl || item.img;
      if (itemImageUrl) {
        promises.push(preloadImage(itemImageUrl));
      }
    });
  }

  // 일부 이미지가 실패해도 계속 진행 (Promise.allSettled 사용)
  return Promise.allSettled(promises);
}

/**
 * 현재 추천의 다음/이전 추천 이미지를 preload합니다.
 * @param {Array} recommendations - 전체 추천 목록
 * @param {number} currentIndex - 현재 추천 인덱스
 * @returns {Promise<PromiseSettledResult[]>} preload 결과
 */
export async function preloadAdjacentRecommendations(recommendations, currentIndex) {
  if (!recommendations || recommendations.length === 0) {
    return Promise.resolve([]);
  }

  const promises = [];
  const total = recommendations.length;

  // 다음 추천 (순환)
  const nextIndex = (currentIndex + 1) % total;
  const nextRecommendation = recommendations[nextIndex];
  if (nextRecommendation) {
    promises.push(preloadRecommendationImages(nextRecommendation));
  }

  // 이전 추천 (순환)
  const prevIndex = (currentIndex - 1 + total) % total;
  const prevRecommendation = recommendations[prevIndex];
  if (prevRecommendation) {
    promises.push(preloadRecommendationImages(prevRecommendation));
  }

  return Promise.allSettled(promises);
}

/**
 * 모든 추천의 메인 이미지를 preload합니다.
 * (성능 최적화: 메인 이미지만 먼저 로드, 아이템 이미지는 필요시 로드)
 * @param {Array} recommendations - 전체 추천 목록
 * @returns {Promise<PromiseSettledResult[]>} preload 결과
 */
export async function preloadAllMainImages(recommendations) {
  if (!recommendations || recommendations.length === 0) {
    return Promise.resolve([]);
  }

  const promises = recommendations.map((recommendation) => {
    const mainImageUrl = recommendation.imageUrl || recommendation.image;
    if (mainImageUrl) {
      return preloadImage(mainImageUrl);
    }
    return Promise.resolve(null);
  });

  return Promise.allSettled(promises);
}

