/**
 * 추천 관련 커스텀 훅
 */
import { useState, useCallback, useEffect } from 'react';
import { getRecommendations } from '../services/recommendationsService';
import { preloadAllMainImages, preloadAdjacentRecommendations } from '../utils/imagePreloader';

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // 추천 데이터 로드
  const loadRecommendations = useCallback(async (params = {}) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getRecommendations(params);
      // API 응답: { outfits: [], pagination: {...} }
      const formattedRecommendations = response.outfits || [];
      setRecommendations(formattedRecommendations);
      setCurrentIndex(0);
      
      // 모든 추천의 메인 이미지를 preload (백그라운드에서 실행)
      if (formattedRecommendations.length > 0) {
        preloadAllMainImages(formattedRecommendations).catch((err) => {
          console.warn('Failed to preload some images:', err);
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to load recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 추천 변경 (이전/다음)
  const changeRecommendation = useCallback((direction) => {
    if (isTransitioning || recommendations.length === 0) return;
    
    setIsTransitioning(true);

    setTimeout(() => {
      if (direction === 'next') {
        setCurrentIndex((prev) => (prev + 1) % recommendations.length);
      } else {
        setCurrentIndex((prev) => (prev - 1 + recommendations.length) % recommendations.length);
      }
      setIsTransitioning(false);
    }, 300);
  }, [isTransitioning, recommendations.length]);

  // 현재 추천 가져오기
  const currentRecommendation = recommendations[currentIndex] || null;

  // currentIndex가 변경될 때마다 다음/이전 추천 이미지 preload
  useEffect(() => {
    if (recommendations.length > 0 && currentIndex >= 0) {
      preloadAdjacentRecommendations(recommendations, currentIndex).catch((err) => {
        console.warn('Failed to preload adjacent recommendation images:', err);
      });
    }
  }, [recommendations, currentIndex]);

  return {
    recommendations,
    currentRecommendation,
    currentIndex,
    isLoading,
    error,
    isTransitioning,
    loadRecommendations,
    changeRecommendation,
    setCurrentIndex,
  };
}

