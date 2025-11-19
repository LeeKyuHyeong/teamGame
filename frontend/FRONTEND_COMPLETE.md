# Frontend 프로젝트 완료: React + TypeScript + Vite

## ✅ 완료된 작업

### 1. 프로젝트 초기 설정
- ✅ Vite + React + TypeScript 프로젝트 생성
- ✅ 필수 패키지 설치
  - axios (API 통신)
  - react-router-dom (라우팅)
  - @tanstack/react-query (데이터 페칭)
  - tailwindcss (스타일링)
- ✅ 환경 변수 설정 (.env, .env.example)
- ✅ Tailwind CSS 설정

### 2. 프로젝트 구조
```
game-frontend/
├── src/
│   ├── api/                    # API 클라이언트
│   │   ├── client.ts           # Axios 클라이언트 설정
│   │   ├── sessions.ts         # 세션 API
│   │   ├── teams.ts            # 팀 API
│   │   ├── participants.ts     # 참가자 API
│   │   └── index.ts
│   │
│   ├── types/                  # TypeScript 타입 정의
│   │   └── index.ts            # 모든 타입 정의
│   │
│   ├── components/             # 재사용 컴포넌트
│   │   └── common/
│   │       └── Layout.tsx      # 레이아웃 컴포넌트
│   │
│   ├── pages/                  # 페이지 컴포넌트
│   │   ├── HomePage.tsx        # 홈 페이지
│   │   ├── SessionListPage.tsx # 세션 목록
│   │   ├── CreateSessionPage.tsx # 세션 생성
│   │   ├── SessionDetailPage.tsx # 세션 상세
│   │   └── GamePlayPage.tsx    # 게임 진행 (Phase 2)
│   │
│   ├── routes/                 # 라우팅 설정
│   │   └── index.tsx
│   │
│   ├── App.tsx                 # 메인 App
│   ├── main.tsx                # 진입점
│   └── index.css               # 글로벌 스타일
│
├── .env                        # 환경 변수
├── tailwind.config.js          # Tailwind 설정
└── package.json
```

### 3. 구현된 페이지 (5개)

#### 1. HomePage (/)
- 게임 시스템 소개
- 4가지 게임 종류 카드
- 세션 시작/목록 버튼

#### 2. SessionListPage (/sessions)
- 세션 목록 조회
- 세션 카드 (이름, 상태, MC, 참가자 수, 날짜)
- 새 세션 만들기 버튼

#### 3. CreateSessionPage (/sessions/new)
- 세션 기본 정보 입력
  - 세션 이름
  - MC 이름
  - 총 참가자 수
- A팀/B팀 참가자 입력
  - 동적으로 참가자 추가 가능
- 자동으로 팀 및 참가자 생성

#### 4. SessionDetailPage (/sessions/:id)
- 세션 정보 표시
- 팀별 점수 및 참가자 목록
- 게임 선택 UI (Phase 2에서 연결 예정)

#### 5. GamePlayPage (/sessions/:sessionId/games/:gameId)
- Phase 2에서 구현 예정 (임시 화면)

### 4. API 통합
- ✅ Axios 클라이언트 설정 (baseURL, interceptors)
- ✅ Sessions API (CRUD)
- ✅ Teams API (CRUD, 점수 업데이트)
- ✅ Participants API (CRUD, 일괄 생성)
- ✅ React Query 통합 (캐싱, 자동 리페치)

### 5. 스타일링
- ✅ Tailwind CSS 설정
- ✅ 반응형 디자인 (모바일, 태블릿, 데스크톱)
- ✅ 일관된 색상 스킴
  - A팀: 파란색 (blue-600)
  - B팀: 분홍색 (pink-600)
- ✅ 상태별 배지 (준비중, 진행중, 완료)

---

## 📁 주요 파일 설명

### API 클라이언트 (`src/api/`)
```typescript
// client.ts - Axios 인스턴스
export const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
});

// sessions.ts - 세션 API
export const sessionsApi = {
  getAll: () => Promise<Session[]>
  getOne: (id) => Promise<Session>
  getDetail: (id) => Promise<Session>
  create: (data) => Promise<Session>
  update: (id, data) => Promise<Session>
  delete: (id) => Promise<void>
}
```

### 타입 정의 (`src/types/index.ts`)
- Session, Team, Participant
- GameType, SessionGame, GameRound
- Song, MediaContent, SpeedCategory, ActionItem
- 각 엔티티의 Create/Update DTO

### 라우팅 (`src/routes/index.tsx`)
```
/ - HomePage
/sessions - SessionListPage
/sessions/new - CreateSessionPage
/sessions/:id - SessionDetailPage
/sessions/:sessionId/games/:gameId - GamePlayPage
```

---

## 🚀 실행 방법

### 1. 패키지 설치
```bash
cd game-frontend
npm install
```

### 2. 환경 변수 설정
`.env` 파일 확인:
```env
VITE_API_URL=http://localhost:3000/api
```

### 3. 개발 서버 실행
```bash
npm run dev
```

기본 URL: `http://localhost:5173`

### 4. 백엔드 연동
백엔드 서버가 `http://localhost:3000`에서 실행 중이어야 합니다.

---

## 🎨 주요 기능 데모

### 세션 생성 플로우
1. 홈 페이지에서 "새 세션 시작하기" 클릭
2. 세션 정보 입력 (이름, MC, 참가자 수)
3. A팀/B팀 참가자 이름 입력
4. "세션 생성" 클릭
5. 자동으로 세션, 팀, 참가자 생성
6. 세션 상세 페이지로 이동

### 세션 관리 플로우
1. 세션 목록에서 세션 선택
2. 세션 상세 정보 확인
3. 팀별 점수 및 참가자 확인
4. 게임 선택 (Phase 2에서 연결)

---

## 📝 Phase 2에서 추가될 기능

### Frontend
1. **게임 선택 UI 연결**
   - SessionDetailPage에서 게임 선택 시 API 호출
   - 게임 진행 상태 관리

2. **게임 진행 화면 (GamePlayPage)**
   - 노래 맞추기: YouTube 임베드, 재생/정지, 정답 공개
   - 드라마/영화: 이미지 표시, 정답 공개
   - 스피드 게임: 2분 타이머, 항목 표시, 점수 입력
   - 동작 게임: 동작 표시, 점수 입력

3. **점수 관리**
   - 라운드별 점수 입력
   - 팀 총점 실시간 업데이트
   - 리더보드 표시

4. **게임 이력**
   - 완료된 게임 결과 조회
   - 라운드별 상세 정보
   - 1등 팀 표시

---

## 🔧 기술 스택

- **Framework**: React 18
- **Build Tool**: Vite 6
- **Language**: TypeScript
- **Routing**: React Router v7
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Code Quality**: ESLint

---

## 📦 총 파일 수

- **API**: 4개
- **Types**: 1개
- **Components**: 1개
- **Pages**: 5개
- **Routes**: 1개
- **Config**: 5개 (.env, tailwind, vite 등)

**총 파일 수: 약 20개**

---

## 다음 단계

Frontend Phase 1 완료! 이제 Backend Phase 2를 진행하면 됩니다.

Phase 2에서는:
1. Games 모듈 (게임 시작/관리)
2. Rounds 모듈 (라운드 진행)
3. Scores 모듈 (점수 부여)
4. Songs/Media/Speed/Actions 모듈 (콘텐츠 관리)

그 후 Frontend에서 게임 진행 화면을 완성합니다.
