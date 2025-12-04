"""
Description embedding 생성 서비스

sentence-transformers/distiluse-base-multilingual-cased-v2 모델을 사용하여
텍스트를 512차원 벡터로 변환합니다.
"""

from typing import List
from functools import lru_cache

from sentence_transformers import SentenceTransformer

# TODO: 데이터주입이 끝나면 모두 주석처리
class EmbeddingService:
    """Description embedding을 생성하는 서비스"""
    
    _instance = None
    _model = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingService, cls).__new__(cls)
            cls._instance._initialize_model()
        return cls._instance
    
    def _initialize_model(self):
        """
        Embedding 모델 초기화 (최초 1회만 실행)
        
        모델: distiluse-base-multilingual-cased-v2
        차원: 512
        """
        if getattr(self, 'model', None) is None:
            model_name = "sentence-transformers/distiluse-base-multilingual-cased-v2"
            # 모델 로딩은 시간이 걸리므로 로그를 남길 수 있음
            print(f"Loading SentenceTransformer model: {model_name}...")
            self.model = SentenceTransformer(model_name)
            self.dimension = 512
            print("Model loaded successfully.")
    
    @lru_cache(maxsize=1000)
    def generate_embedding(self, text: str) -> List[float]:
        """
        텍스트를 embedding 벡터로 변환
        
        Args:
            text: 변환할 텍스트
            
        Returns:
            embedding 벡터 (512차원 리스트)
        """
        if not text or not text.strip():
            return [0.0] * self.dimension
        
        try:
            # 모델 인스턴스가 없으면 초기화 (안전장치)
            if self.model is None:
                self._initialize_model()
                
            embedding = self.model.encode(
                text,
                normalize_embeddings=True,
                show_progress_bar=False
            )
            return embedding.tolist()
        except Exception as e:
            print(f"Embedding 생성 실패: {e}")
            return [0.0] * self.dimension

