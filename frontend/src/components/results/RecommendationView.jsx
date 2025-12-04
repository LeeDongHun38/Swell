/**
 * 추천 결과 화면 컴포넌트
 */
import React from 'react';
import { ChevronLeft, ChevronRight, Heart, ShoppingBag } from 'lucide-react';
import { SwellLogo } from '../SwellLogo';
import { formatTags, formatPrice } from '../../utils/formatters';

export function RecommendationView({
  recommendation,
  currentIndex,
  totalCount,
  isTransitioning,
  onChangeRecommendation,
  onReset,
  onLike,
}) {
  if (!recommendation) return null;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* 상단 네비게이션바 */}
      <div className="flex justify-between items-center mb-4 px-2 stagger-item shrink-0" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center gap-3">
          <SwellLogo className="w-16 h-16 drop-shadow-sm" />
          <h2 className="text-3xl font-bold text-slate-900 font-brand">Swell</h2>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
          <span>{currentIndex + 1}</span>
          <span className="text-slate-300">/</span>
          <span>{totalCount}</span>
        </div>
      </div>

      <div className={`flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 h-full min-h-0 pb-6 fade-transition ${isTransitioning ? 'hidden-state' : ''}`}>

        {/* 왼쪽 컬럼: 코디 이미지 */}
        <div className="lg:col-span-7 flex flex-col h-full min-h-0 relative group">
          <div className="relative flex-1 bg-gray-200 rounded-3xl overflow-hidden shadow-sm border border-slate-100 min-h-0 group">

            <div
              className="absolute inset-0 bg-cover bg-center blur-2xl opacity-60 scale-110 transition-all duration-700"
              style={{ backgroundImage: `url(${recommendation.imageUrl || recommendation.image})` }}
            />

            <img
              key={currentIndex}
              src={recommendation.imageUrl || recommendation.image}
              alt={recommendation.title || "Outfit Recommendation"}
              className="absolute inset-0 z-10 w-full h-full object-contain"
            />

            {/* 네비게이션 버튼 */}
            <button
              onClick={() => onChangeRecommendation('prev')}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white text-slate-900 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 opacity-0 group-hover:opacity-100 z-20"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => onChangeRecommendation('next')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white text-slate-900 rounded-full shadow-lg backdrop-blur-sm transition-all hover:scale-110 opacity-0 group-hover:opacity-100 z-20"
            >
              <ChevronRight size={24} />
            </button>

            <button
              onClick={onLike}
              className="absolute bottom-6 right-6 p-3.5 bg-white text-rose-500 rounded-full shadow-xl hover:scale-110 transition-transform z-20"
            >
              <Heart size={24} fill="currentColor" />
            </button>
          </div>

          <div className="mt-4 flex flex-col items-center text-center shrink-0">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
              {formatTags(recommendation.descriptionTags || recommendation.tags || [])}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3 break-keep">
              {recommendation.descriptionText || recommendation.title || recommendation.style || '스타일 추천'}
            </h3>

            {recommendation.llmMessage && (
              <div className="relative bg-white border border-slate-200 rounded-2xl p-4 shadow-sm max-w-lg mx-auto">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-slate-200 transform rotate-45"></div>
                <div className="flex gap-3 items-start text-left">
                  <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 break-keep">
                    {recommendation.llmMessage}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽 컬럼: 아이템 리스트 */}
        <div className="lg:col-span-5 flex flex-col h-full min-h-0 pl-0 lg:pl-4">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 shrink-0">
            착용 아이템
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">
              {recommendation.items?.length || 0}
            </span>
          </h3>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar min-h-0">
            {recommendation.items?.map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex gap-4 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
              >
                <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                  <img
                    src={item.imageUrl || item.img}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">
                    {item.brand || item.brandNameKo}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mb-1 line-clamp-1">
                    {item.name || item.itemName}
                  </h4>
                  <p className="text-sm font-medium text-slate-700">
                    {item.price ? formatPrice(item.price) : '가격 정보 없음'}
                  </p>
                </div>

                <div className="flex items-center pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-2 bg-slate-900 text-white rounded-full">
                    <ShoppingBag size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center shrink-0">
            <button
              onClick={onReset}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              처음으로
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => onChangeRecommendation('prev')}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => onChangeRecommendation('next')}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

