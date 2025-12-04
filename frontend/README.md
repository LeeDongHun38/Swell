# Swell Frontend

Swell 스타일 추천 서비스의 프론트엔드 애플리케이션입니다.

## 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── onboarding/     # 온보딩 단계별 컴포넌트
│   ├── results/        # 결과 화면 컴포넌트
│   └── ...            # 공통 컴포넌트
├── constants/          # 상수 정의
│   ├── api.js         # API 엔드포인트
│   └── onboarding.js  # 온보딩 관련 상수
├── hooks/             # 커스텀 훅
│   ├── useOnboarding.js
│   └── useRecommendations.js
├── services/          # API 서비스 레이어
│   ├── api.js         # 기본 API 클라이언트
│   ├── onboardingService.js
│   └── recommendationsService.js
├── styles/            # 스타일 파일
│   └── global.css
├── utils/             # 유틸리티 함수
│   ├── validation.js
│   └── formatters.js
├── App.jsx            # 메인 App 컴포넌트
└── main.jsx           # 엔트리 포인트
```

## 주요 기능

### 1. 온보딩 플로우
- Step 1: 성별 선택
- Step 2: 스타일 태그 선택 (최소 3개, 최대 10개)
- Step 3: 선호 코디 선택 (정확히 5개)

### 2. 추천 시스템
- 사용자 선호사항 기반 추천
- 코디 상세 정보 및 아이템 목록 표시
- 좋아요 및 조회 로그 기능

## 개발 환경 설정

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.example`을 참고하여 `.env` 파일을 생성하세요:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 프로덕션 빌드
```bash
npm run build
```

## API 연동

### 백엔드 API 엔드포인트

프로젝트는 다음 API 엔드포인트를 사용합니다:

- `GET /api/tags` - 태그 목록 조회
- `GET /api/users/onboarding/sample-coordis` - 샘플 코디 목록 조회
- `POST /api/users/onboarding/preferences` - 온보딩 선호사항 제출
- `GET /api/recommendations` - 추천 코디 목록 조회
- `POST /api/outfits/:id/like` - 코디 좋아요
- `POST /api/outfits/:id/view` - 코디 조회 로그

자세한 API 스펙은 `src/constants/api.js`를 참고하세요.

## Best Practices 적용

### 1. 컴포넌트 분리
- 단일 책임 원칙에 따라 각 컴포넌트는 하나의 역할만 수행
- 재사용 가능한 컴포넌트로 분리

### 2. 커스텀 훅
- 비즈니스 로직을 커스텀 훅으로 분리
- 상태 관리와 사이드 이펙트를 훅으로 캡슐화

### 3. API 서비스 레이어
- API 호출 로직을 서비스 레이어로 분리
- 백엔드 API 변경 시 한 곳만 수정하면 됨

### 4. 상수 관리
- 하드코딩된 값들을 상수 파일로 분리
- 유지보수성 향상

### 5. 유틸리티 함수
- 재사용 가능한 로직을 유틸리티 함수로 분리
- 테스트 가능한 순수 함수로 구현

## 기술 스택

- **React 18** - UI 라이브러리
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링
- **Lucide React** - 아이콘 라이브러리

## 향후 개선 사항

- [ ] TypeScript 마이그레이션
- [ ] 상태 관리 라이브러리 도입 (Zustand/Redux)
- [ ] 에러 바운더리 추가
- [ ] 로딩 상태 개선
- [ ] 테스트 코드 작성
- [ ] 접근성 개선

