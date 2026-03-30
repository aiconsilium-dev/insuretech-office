# InsureTech Office (관리사무소 앱)

아파트 단지 관리사무소를 위한 보험 접수 관리, 현장조사, AI 분류 모바일 웹 앱.

## 🚀 Live Demo

[https://aiconsilium-dev.github.io/insuretech-office/](https://aiconsilium-dev.github.io/insuretech-office/)

URL 파라미터:
```
?name=김관리&apt=헬리오시티
```

## 📋 기능

- **대시보드**: KPI (금일접수/처리중/현장조사), TYPE별 현황, AI 알림, 최근 접수
- **접수관리**: TYPE/출처 필터, 상세 확장, 상태 변경, 현장조사 배정
- **신규접수**: 공용부 사고접수 + 비입주민 대리접수, AI TYPE 분류
- **더보기**: 현장조사 관리 (대기/진행/완료), 품셈 확인, 구상권 현황

## 🛠 Tech Stack

| 기술 | 버전 |
|------|------|
| React | 19 |
| Vite | 8 |
| Tailwind CSS | 4 (v4 @tailwindcss/vite) |
| TypeScript | 5 (strict) |
| pnpm | 10+ |

## 📁 프로젝트 구조

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── lib/types.ts
├── contexts/AppContext.tsx
├── components/
│   ├── layout/BottomTabBar.tsx
│   └── common/
│       ├── Pill.tsx
│       ├── StatusBadge.tsx
│       └── StatusSteps.tsx
└── pages/
    ├── DashboardPage.tsx
    ├── ClaimsPage.tsx
    ├── NewClaimPage.tsx
    └── MorePage.tsx
```

## 🏃 로컬 실행

```bash
pnpm install
pnpm dev     # http://localhost:3002
```

## 📦 빌드 & 배포

```bash
pnpm build   # dist/ 생성
# gh-pages 브랜치로 push
```
