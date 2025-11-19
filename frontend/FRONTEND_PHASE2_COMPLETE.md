# Frontend Phase 2 완료: 콘텐츠 관리 시스템

## ✅ 완료된 작업

### 1. 콘텐츠 관리 페이지
**경로**: `/content`
**파일**: `src/pages/content/`

#### 새로 추가된 컴포넌트 (5개)
1. ✅ **ContentManagementPage** - 메인 페이지 (탭 관리)
2. ✅ **SongsManager** - 노래 관리
3. ✅ **MediaManager** - 드라마/영화 관리
4. ✅ **SpeedManager** - 스피드 게임 관리
5. ✅ **ActionsManager** - 동작 게임 관리

---

### 2. Phase 2 API 통합

#### 새로 추가된 API 클라이언트
- `games.ts` - 게임 관리 API (7개 함수)
- `songs.ts` - 노래 API (6개 함수)
- `content.ts` - 미디어/스피드/동작/라운드/점수 API (30+ 함수)

#### API 함수 목록
**Games**
- getGameTypes() - 게임 타입 목록
- getBySession() - 세션의 게임 목록
- create() - 게임 추가
- start() - 게임 시작
- complete() - 게임 완료

**Songs**
- getAll() - 전체 노래
- getRandom(count) - 랜덤 노래
- create() - 노래 추가
- update() - 노래 수정
- delete() - 노래 삭제

**Media**
- getAll() - 전체 드라마/영화
- getRandom(count) - 랜덤 선택
- create() - 추가
- delete() - 삭제

**Speed**
- getAllCategories() - 유형 목록
- getCategory(id) - 유형 상세
- getShuffled(id) - 셔플된 항목
- createCategory() - 유형 생성
- createItem() - 항목 추가
- deleteCategory() - 유형 삭제
- deleteItem() - 항목 삭제

**Actions**
- getAll() - 동작 목록
- getRandom(count) - 랜덤 동작
- create() - 추가
- delete() - 삭제

**Rounds**
- getByGame() - 게임의 라운드
- getOne() - 라운드 상세
- getNext() - 다음 라운드
- revealAnswer() - 정답 공개

**Scores**
- getByRound() - 라운드별 점수
- assignScore() - 점수 부여
- compareScores() - 점수 비교

---

### 3. 콘텐츠 관리 기능

#### 노래 관리 (SongsManager)
**기능**:
- ✅ 노래 목록 조회
- ✅ 노래 추가 (YouTube URL, 제목, 가수, 시작시간)
- ✅ 노래 수정
- ✅ 노래 삭제
- ✅ 실시간 목록 업데이트

**UI 특징**:
- 폼 토글 (추가/취소)
- YouTube 링크 표시
- 수정/삭제 버튼

#### 드라마/영화 관리 (MediaManager)
**기능**:
- ✅ 드라마/영화 목록 조회
- ✅ 추가 (제목, 타입, 이미지 경로, 설명)
- ✅ 삭제
- ✅ 타입별 필터링 (드라마/영화)

**UI 특징**:
- 그리드 레이아웃
- 타입 배지 표시
- 카드 형식 UI

#### 스피드 게임 관리 (SpeedManager)
**기능**:
- ✅ 유형(카테고리) 생성/삭제
- ✅ 유형별 항목 추가/삭제
- ✅ 유형 선택 시 항목 관리
- ✅ 항목 개수 표시

**UI 특징**:
- 좌측: 유형 목록 (선택형)
- 우측: 선택한 유형의 항목 관리
- 3열 그리드 레이아웃
- 인라인 항목 추가

#### 동작 게임 관리 (ActionsManager)
**기능**:
- ✅ 동작 목록 조회
- ✅ 동작 추가 (이름, 설명)
- ✅ 동작 삭제

**UI 특징**:
- 그리드 레이아웃
- 카드 형식
- 간단한 CRUD

---

### 4. TypeScript 타입 업데이트

추가된 타입:
```typescript
// 게임
CreateSessionGameDto
StartGameDto
GameType
SessionGame

// 점수
AssignScoreDto
RoundScore

// 콘텐츠
CreateSongDto
CreateMediaDto
CreateSpeedCategoryDto
CreateSpeedItemDto
CreateActionDto
```

---

### 5. 내비게이션 업데이트

#### 헤더 메뉴
- 홈
- 세션 관리
- **콘텐츠 관리** ⭐ (새로 추가)

#### 라우팅
```
/content - 콘텐츠 관리 페이지
  - 노래 탭
  - 드라마/영화 탭
  - 스피드 게임 탭
  - 동작 게임 탭
```

---

## 📊 Phase 2 통계

### 새로 추가된 파일
- 페이지: 5개
- API 클라이언트: 3개
- 타입 정의: 10+ 개
- **총 파일: 약 20개**

### 기능 수
- CRUD 작업: 20+개
- API 함수: 40+개
- UI 컴포넌트: 5개

---

## 🎨 UI/UX 특징

### 일관된 디자인
- Tailwind CSS 기반
- 반응형 그리드 레이아웃
- 모바일/태블릿/데스크톱 지원

### 상호작용
- 폼 토글 (추가/취소)
- 실시간 목록 업데이트 (React Query)
- 확인 다이얼로그 (삭제 시)
- 로딩 상태 표시

### 색상 스킴
- Primary: Blue (파란색)
- Danger: Red (빨간색)
- Neutral: Gray (회색)

---

## 🚀 사용 방법

### 1. 노래 추가
1. "콘텐츠 관리" 메뉴 클릭
2. "노래 맞추기" 탭 선택
3. "+ 노래 추가" 클릭
4. 정보 입력:
   - YouTube URL: `https://www.youtube.com/watch?v=...`
   - 제목: "Dynamite"
   - 가수: "BTS"
   - 시작 시간: 0 (선택사항)
5. "추가" 클릭

### 2. 드라마/영화 추가
1. "드라마/영화" 탭
2. "+ 추가" 클릭
3. 정보 입력:
   - 제목: "오징어게임"
   - 타입: 드라마
   - 이미지 경로: `/uploads/squid_game.jpg`
   - 설명 (선택)
4. "추가" 클릭

### 3. 스피드 게임 준비
1. "스피드 게임" 탭
2. "+ 유형 추가" 클릭
3. 유형 이름: "과일 이름" 입력
4. 왼쪽에서 유형 선택
5. 오른쪽에서 항목 추가:
   - "사과"
   - "바나나"
   - "딸기"
   - ...

### 4. 동작 게임 준비
1. "동작 게임" 탭
2. "+ 동작 추가" 클릭
3. 정보 입력:
   - 동작 이름: "박수치기"
   - 설명: "양손으로 박수를 친다"
4. "추가" 클릭

---

## 🔄 데이터 흐름

### 추가 플로우
```
사용자 입력
→ 폼 제출
→ API 호출 (create)
→ Backend 저장
→ React Query 캐시 무효화
→ 목록 자동 재조회
→ UI 업데이트
```

### 삭제 플로우
```
삭제 버튼 클릭
→ 확인 다이얼로그
→ API 호출 (delete)
→ Backend 삭제
→ React Query 캐시 무효화
→ 목록 자동 재조회
→ UI 업데이트
```

---

## 📝 다음 단계

### 완료된 것
- ✅ Phase 1: 세션/팀/참가자 관리
- ✅ Phase 2: 콘텐츠 관리 시스템

### 남은 작업
- ⏳ **게임 진행 화면** (GamePlayPage)
  - 노래 맞추기: YouTube 임베드
  - 드라마/영화: 이미지 표시
  - 스피드 게임: 타이머 + 항목 표시
  - 동작 게임: 동작 표시
- ⏳ **점수 입력 UI**
  - MC가 점수 부여
  - 팀별 점수 표시
- ⏳ **게임 이력 조회**
  - 완료된 게임 결과
  - 라운드별 상세

---

## 💡 팁

### 콘텐츠 준비 순서 (추천)
1. 노래 5-10개 추가
2. 드라마/영화 5-10개 추가
3. 스피드 게임 유형 2-3개 생성 (각 10개 항목)
4. 동작 5-10개 추가

### YouTube URL 찾는 방법
1. YouTube에서 노래 검색
2. 주소창의 URL 복사
3. 형식: `https://www.youtube.com/watch?v=VIDEO_ID`

### 이미지 경로
- 실제 환경에서는 파일 업로드 기능 필요
- 현재는 임시로 경로 입력
- 예: `/uploads/squid_game.jpg`

---

## 🎉 Phase 2 완료!

콘텐츠 관리 시스템이 완성되었습니다!

이제 게임을 진행하기 전에 필요한 모든 콘텐츠를 미리 등록할 수 있습니다.

다음 단계에서는 실제 게임 진행 화면을 구현하겠습니다! 🎮
