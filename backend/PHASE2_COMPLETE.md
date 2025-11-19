# Backend Phase 2 완료: 게임 진행 핵심 기능

## ✅ 완료된 작업

### 1. Games 모듈 (게임 관리)
**파일**: `src/modules/games/`
- games.service.ts
- games.controller.ts
- games.module.ts
- DTOs: create-session-game.dto, start-game.dto, game-response.dto

**API 엔드포인트** (7개):
```
GET    /api/games/types              # 게임 타입 목록
GET    /api/games?sessionId=1        # 세션의 게임 목록
GET    /api/games/:id                # 게임 상세
POST   /api/games                    # 세션에 게임 추가
PATCH  /api/games/:id/start          # 게임 시작
PATCH  /api/games/:id/complete       # 게임 완료
DELETE /api/games/:id                # 게임 삭제
```

**주요 기능**:
- 세션에 게임 추가 (노래/드라마/스피드/동작)
- 게임 시작 시 라운드 자동 생성
- 게임 상태 관리 (대기/진행중/완료)

---

### 2. Rounds 모듈 (라운드 진행)
**파일**: `src/modules/rounds/`
- rounds.service.ts
- rounds.controller.ts
- rounds.module.ts
- DTOs: create-round.dto, reveal-answer.dto, round-with-content.dto

**API 엔드포인트** (6개):
```
POST   /api/rounds                       # 라운드 생성
GET    /api/rounds?sessionGameId=1      # 게임의 라운드 목록
GET    /api/rounds/:id                  # 라운드 상세 (콘텐츠 포함)
GET    /api/rounds/game/:id/next        # 다음 라운드 조회
PATCH  /api/rounds/:id/reveal           # 정답 공개/숨김
DELETE /api/rounds/:id                  # 라운드 삭제
```

**주요 기능**:
- 게임 타입별 콘텐츠 로딩 (Song, Media, Speed, Action)
- 정답 공개 전: 제목/가수 정보 숨김
- 정답 공개 후: 전체 정보 표시
- 다음 라운드 자동 조회

---

### 3. Scores 모듈 (점수 관리)
**파일**: `src/modules/scores/`
- scores.service.ts
- scores.controller.ts
- scores.module.ts
- DTOs: assign-score.dto, update-score.dto

**API 엔드포인트** (6개):
```
POST   /api/scores                      # 점수 부여
GET    /api/scores?roundId=1            # 라운드별 점수 조회
GET    /api/scores?teamId=1             # 팀별 점수 조회
GET    /api/scores/:id                  # 점수 상세
GET    /api/scores/round/:id/compare    # 라운드 점수 비교
PATCH  /api/scores/:id                  # 점수 수정
DELETE /api/scores/:id                  # 점수 삭제
```

**주요 기능**:
- 라운드별 팀 점수 부여
- 중복 점수 방지 (unique constraint)
- 팀 총점 자동 업데이트
- 라운드 승자 판정 (스피드/동작 게임)

---

### 4. 콘텐츠 모듈 (4개)

#### Songs 모듈
**API**: `/api/songs`
```
POST   /api/songs                # 노래 추가
GET    /api/songs                # 노래 목록
GET    /api/songs?random=5       # 랜덤 노래 5개
GET    /api/songs/:id            # 노래 상세
PATCH  /api/songs/:id            # 노래 수정
DELETE /api/songs/:id            # 노래 삭제
```

**필드**:
- youtubeUrl: YouTube URL
- title: 노래 제목
- artist: 가수명
- startTime: 시작 시간(초)

#### Media 모듈
**API**: `/api/media`
```
POST   /api/media                # 드라마/영화 추가
GET    /api/media                # 목록
GET    /api/media?random=5       # 랜덤 5개
GET    /api/media/:id            # 상세
PATCH  /api/media/:id            # 수정
DELETE /api/media/:id            # 삭제
```

**필드**:
- imagePath: 이미지 경로
- title: 드라마/영화 제목
- mediaType: '드라마' | '영화'
- description: 설명

#### Speed 모듈
**API**: `/api/speed`
```
POST   /api/speed/categories              # 유형 생성
GET    /api/speed/categories              # 유형 목록
GET    /api/speed/categories/:id          # 유형 상세
GET    /api/speed/categories/:id/shuffled # 항목 셔플
DELETE /api/speed/categories/:id          # 유형 삭제

POST   /api/speed/items                   # 항목 추가
DELETE /api/speed/items/:id               # 항목 삭제
```

**구조**:
- SpeedCategory: 유형 (예: 과일, 나라)
- SpeedItem: 항목 (예: 사과, 바나나)

#### Actions 모듈
**API**: `/api/actions`
```
POST   /api/actions              # 동작 추가
GET    /api/actions              # 동작 목록
GET    /api/actions?random=5     # 랜덤 5개
GET    /api/actions/:id          # 상세
PATCH  /api/actions/:id          # 수정
DELETE /api/actions/:id          # 삭제
```

**필드**:
- actionName: 동작 이름
- description: 설명

---

## 📊 Phase 2 통계

### 새로 추가된 모듈
- Games (게임 관리)
- Rounds (라운드 진행)
- Scores (점수 관리)
- Songs (노래 콘텐츠)
- Media (드라마/영화 콘텐츠)
- Speed (스피드 게임 콘텐츠)
- Actions (동작 게임 콘텐츠)

**총 7개 모듈**

### API 엔드포인트
- Phase 1: 18개
- Phase 2: 31개
- **총계: 49개**

### 파일 수
- Service: 7개
- Controller: 7개
- Module: 7개
- DTOs: 약 15개
- **총 약 36개 파일**

---

## 🎮 게임 진행 플로우

### 1. 세션 생성 및 게임 추가
```bash
# 1. 세션 생성
POST /api/sessions
{
  "sessionName": "2024 송년회",
  "mcName": "김진행"
}

# 2. 팀 생성
POST /api/teams
{
  "sessionId": 1,
  "teamName": "A팀",
  "teamType": "남성"
}

# 3. 게임 추가
POST /api/games
{
  "sessionId": 1,
  "gameCode": "SONG",
  "gameOrder": 1
}
```

### 2. 게임 시작
```bash
# 노래 5개 선택해서 게임 시작
PATCH /api/games/1/start
{
  "contentIds": [1, 2, 3, 4, 5]
}

# → 자동으로 5개 라운드 생성
```

### 3. 라운드 진행
```bash
# 1. 첫 번째 라운드 조회 (정답 숨김)
GET /api/rounds/1
# Response:
{
  "id": 1,
  "roundNumber": 1,
  "isAnswerRevealed": false,
  "content": {
    "youtubeUrl": "https://youtube.com/...",
    "title": null,      # 숨김
    "artist": null      # 숨김
  }
}

# 2. 노래 재생 (Frontend에서 YouTube 임베드)

# 3. 팀이 정답 맞춤 → MC가 점수 부여
POST /api/scores
{
  "roundId": 1,
  "teamId": 1,
  "score": 10
}

# 4. 정답 공개
PATCH /api/rounds/1/reveal
{
  "reveal": true
}
# Response:
{
  "content": {
    "title": "Dynamite",
    "artist": "BTS"
  }
}
```

### 4. 스피드 게임 플로우
```bash
# 1. 유형의 항목을 셔플해서 가져오기
GET /api/speed/categories/1/shuffled
# Response: 랜덤 순서의 항목 배열

# 2. 2분 타이머 (Frontend)

# 3. 각 팀이 맞춘 개수 입력
POST /api/scores
{
  "roundId": 5,
  "teamId": 1,
  "score": 15,
  "correctCount": 15
}

POST /api/scores
{
  "roundId": 5,
  "teamId": 2,
  "score": 12,
  "correctCount": 12
}

# 4. 점수 비교
GET /api/scores/round/5/compare
# Response:
{
  "scores": [
    {"teamId": 1, "teamName": "A팀", "score": 15},
    {"teamId": 2, "teamName": "B팀", "score": 12}
  ],
  "winner": {"teamId": 1, "teamName": "A팀"}
}
```

---

## 🧪 테스트 가이드

### 1. 노래 추가
```bash
curl -X POST http://localhost:3000/api/songs \
  -H "Content-Type: application/json" \
  -d '{
    "youtubeUrl": "https://www.youtube.com/watch?v=TgOu00Mf3kI",
    "title": "Dynamite",
    "artist": "BTS",
    "startTime": 0
  }'
```

### 2. 드라마 추가
```bash
curl -X POST http://localhost:3000/api/media \
  -H "Content-Type: application/json" \
  -d '{
    "imagePath": "/uploads/squid_game.jpg",
    "title": "오징어게임",
    "mediaType": "드라마"
  }'
```

### 3. 스피드 게임 준비
```bash
# 유형 생성
curl -X POST http://localhost:3000/api/speed/categories \
  -H "Content-Type: application/json" \
  -d '{
    "categoryName": "과일 이름"
  }'

# 항목 추가
curl -X POST http://localhost:3000/api/speed/items \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": 1,
    "itemName": "사과"
  }'
```

### 4. 게임 시작
```bash
# 게임 타입 조회
curl http://localhost:3000/api/games/types

# 세션에 게임 추가
curl -X POST http://localhost:3000/api/games \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": 1,
    "gameCode": "SONG",
    "gameOrder": 1
  }'

# 게임 시작 (노래 3개)
curl -X PATCH http://localhost:3000/api/games/1/start \
  -H "Content-Type: application/json" \
  -d '{
    "contentIds": [1, 2, 3]
  }'
```

---

## 🔄 다음 단계: Frontend Phase 2

이제 Backend Phase 2가 완료되었으니, Frontend에서 게임 진행 화면을 구현할 수 있습니다!

### Frontend 구현 필요 사항:

1. **게임 선택 화면**
   - SessionDetailPage에서 게임 추가
   - 콘텐츠 선택 (노래/드라마/스피드/동작)

2. **게임 진행 화면** (GamePlayPage)
   - 노래 맞추기: YouTube 임베드, 재생/정지, 정답 공개
   - 드라마/영화: 이미지 표시, 정답 공개
   - 스피드 게임: 2분 타이머, 항목 표시, 점수 입력
   - 동작 게임: 동작 표시, 점수 입력

3. **점수 관리**
   - MC가 점수 입력
   - 팀별 총점 실시간 업데이트
   - 라운드별 결과 표시

Frontend Phase 2를 진행할까요? 🎨
