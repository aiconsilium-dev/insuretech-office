# CLAUDE.md — insuretech-office 개발 가이드

## 프로젝트 개요
관리사무소 앱 — 공용부 보험사고 접수·관리 모바일 웹
- 데모: https://juh-oh.github.io/insuretech-office/

## 기술 스택
| 역할 | 기술 |
|------|------|
| UI 프레임워크 | React 19 |
| 언어 | TypeScript 5 (strict) |
| 번들러 | Vite 8 |
| 라우팅 | React Router DOM v7 (HashRouter) |
| 서버 상태 | TanStack React Query v5 |
| 클라이언트 상태 | Zustand v5 |
| HTTP 클라이언트 | fetch 래퍼 (apiFetch) |
| 스타일링 | Tailwind CSS v4 (@tailwindcss/vite) |
| 아이콘 | Lucide React |
| 조건부 클래스 | clsx |
| API 모킹 | MSW (Mock Service Worker) v2 |
| 패키지 매니저 | pnpm |
| 배포 | GitHub Pages (gh-pages) |

## 환경 변수
- `VITE_API_BASE_URL` — API 서버 주소
- `VITE_USE_MOCK=true` — MSW 모킹 활성화
- `.env.example` 파일 참고, `.env.local`은 `.gitignore`에 포함

## 개발 명령어
```bash
pnpm dev          # 개발 서버 (--host 모드)
pnpm build        # 타입체크 후 프로덕션 빌드
pnpm lint         # ESLint
pnpm preview      # 빌드 결과 미리보기
```

## 폴더 구조 (FSD)
```
src/
├── App.tsx / main.tsx / index.css
├── pages/           ← 페이지별 FSD 구조
│   ├── login/
│   ├── dashboard/   (overview/KPIGrid, QuickMenuItem)
│   ├── new-claim/   (step1-*/step2-*/step3-*, types.ts, constants.ts)
│   ├── claims/      (claim-list/*, types.ts, constants.ts, utils.ts)
│   ├── field-check/ (inspection/*, types.ts)
│   └── more/        (indemnity/, pricing/, settings/)
├── components/      ← 공통 컴포넌트
│   ├── layout/      (BottomTabBar)
│   └── common/      (Card, Badge, Modal, Form, PhotoCapture, ...)
├── hooks/           ← 커스텀 훅 (useMe, useClaims, ...)
├── stores/          ← Zustand 스토어 (authStore)
├── lib/             ← 유틸·API
│   ├── types.ts
│   ├── queryClient.ts / queryKeys.ts
│   └── api/         (client.ts, auth.ts, claims.ts, ...)
├── contexts/        ← React Context (AppContext)
└── mocks/           ← MSW 설정
    ├── browser.ts
    ├── handlers/    (auth, claims, fieldChecks, notifications)
    └── data/        (claims, users, apartments)
```

## 코딩 규칙

### TypeScript
- `strict: true`, `any` 금지
- `@/*` 경로 별칭 필수 (절대 상대경로 `../../` 사용 금지)

### API
- `apiFetch` 래퍼 사용 (`lib/api/client.ts`), 직접 `fetch` 금지
- 에러는 API 레이어에서 `throw`, 훅에서 `catch`
- `axios` 사용 금지

### 상태 관리
- API 응답 → React Query (`useQuery` / `useMutation`)
- 인증 → Zustand (`stores/authStore.ts`)
- 폼 → `useState`
- 쿼리키 → `lib/queryKeys.ts` 팩토리 함수 사용

### 컴포넌트
- `React.FC<Props>` 또는 typed function props
- `clsx`로 조건부 클래스
- `lucide-react` named import (아이콘)

### 스타일
- Tailwind CSS 전용, 인라인 `style` 최소화
- 모바일 레이아웃: `max-w-[430px]`
- Tailwind CSS v4: 설정파일 없이 `@tailwindcss/vite` 플러그인

### 라우팅
- **HashRouter 사용** (GitHub Pages), BrowserRouter 금지
- auth 가드 필요 시 라우터 레벨에서 처리

### 인증
- `access_token` 쿠키, `refresh_token` HTTP-Only
- `tryRefresh()` 로직 포함
- `auth:logout` 이벤트로 글로벌 로그아웃

### MSW
- `VITE_USE_MOCK=true` 시 활성화
- `handlers/` + `data/` 분리
- `public/mockServiceWorker.js` 수동 편집 금지

### Git
- `.env.local` 등 민감정보 커밋 금지

## 주의사항
- React 19 전용 API 사용 가능
- NewClaimPage (`pages/new-claim/`): 3단계 마법사, step1-*/step2-*/step3-* 디렉터리만 신중히 편집

## 구현 전 체크리스트
1. **영향 범위 파악**: query/state 소비하는 컴포넌트·훅 나열
2. **React Strict Mode**: useEffect cleanup 작성
3. **refetch 범위**: invalidateQueries 의도한 쿼리만
4. **TYPE 분류 일관성**: TYPE_MAP, AMOUNT_MAP, DAMAGE_LABELS 세 곳 모두 갱신
5. **타입 정확성**: 라이브러리 옵션 타입 확인
