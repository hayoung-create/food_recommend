# NutriPick 개발 계획

기준 문서: `docs/PRD.md`  
전제: 보일러플레이트(FastAPI + SQLite + React Vite)와 가상환경은 이미 준비됨.  
프로젝트 생성·환경 설정·scaffold 단계는 본 계획에서 제외한다.

---

## 1. 현재 상태 (확인 기준)

```
food_recommend/
├── backend/
│   ├── main.py              # FastAPI, CORS, SQLModel, SQLite, /health
│   ├── requirements.txt     # fastapi, uvicorn, sqlmodel, requests, python-dotenv
│   ├── app.db
│   └── venv/                # 기존 가상환경 사용
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # /health 연결 확인용
│   │   ├── api.js
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json         # react, vite
│   └── vite.config.js
└── docs/
    ├── PRD.md
    ├── UI_GUIDE.md
    ├── DESIGM_SYSTEM.md
    └── reference/           # main.png, recommend.png, detail.png
```

이미 있는 것: 서버 실행, CORS, SQLite 엔진, `/health`, 프론트 health 체크  
아직 없는 것: Product 모델, 공공데이터 수집, 추천 로직, 도메인 API, NutriPick UI

원칙
- 기존 파일·설정을 다시 만들지 않는다.
- 필요한 폴더·파일만 추가한다.
- 프론트는 공공 API를 직접 호출하지 않는다. FastAPI만 호출한다.
- 공공 API 키는 `.env`의 `DATA_GO_KR_SERVICE_KEY`만 사용한다.

---

## 2. 전체 개발 흐름

```
[백엔드]
  데이터 수집·적재 → DB 모델 → 추천 알고리즘 → FastAPI 엔드포인트
       ↓
[프론트엔드]
  공통 UI/라우팅 → 홈(목표 선택) → 추천 결과 → 상세(표·차트·이유) → 검색
       ↓
[마무리]
  반응형·접근성 → README 정리 → MVP 검증
       ↓
[추가 기능]  (MVP 완료 후, 별도 지시 시)
```

성공 기준 (PRD)
- 건강 목표 선택 가능
- 추천 결과 3초 이내 (SQLite 조회 기준)
- 목표별 TOP5 제공
- 상세에서 영양성분·추천 이유·막대그래프 확인
- 식품분류 선택 시 카테고리 내 재정규화

---

## 3. MVP 개발 순서

### Phase A — 백엔드: 데이터 수집 & SQLite 적재

목표: 식약처 OpenAPI를 1회 수집해 SQLite에 저장하고, 이후 요청은 DB만 조회한다.

1. `.env` / `.env.example`에 `DATA_GO_KR_SERVICE_KEY` 정의 (키 하드코딩 금지)
2. Product(SQLModel) 모델 추가 — 식품명, 분류, 제조사, 영양성분 컬럼
3. 수집 스크립트 (`backend/scripts/`)  
   - 페이지네이션  
   - 실패 시 최대 3회 재시도 후 해당 페이지 스킵·로그  
   - 필드 매핑 (제조사 필드 존재 여부 확인)
4. 전처리: 100g/100ml 기준 확인, 결측은 NULL 유지 (제외하지 않음)
5. SQLite(`app.db`)에 upsert/적재 후 건수·분류 목록 점검

의존 라이브러리(필요 시 추가): `pandas` (정제·정규화용)

---

### Phase B — 백엔드: 추천 알고리즘

목표: PRD 규칙 기반 점수 계산. 하드코딩 추천 금지.

1. Min-Max 정규화 유틸
2. 낮을수록 가점 항목 반전 (`1 - normalized`): 칼로리, 지방, 당류, 나트륨
3. 목표별 가중치 적용

| 목표 | 단백질 | 칼로리 | 지방 | 당류 | 나트륨 |
|------|--------|--------|------|------|--------|
| 다이어트 | 25% | 35% | 20% | 20% | - |
| 고단백 | 70% | - | 30% | - | - |
| 저염식 | - | - | - | - | 100% |
| 저당식 | - | - | - | 100% | - |

4. `recommend_score = round(score * 100)`
5. 동점 시 단백질 높은 순
6. 전체 식품 기준 TOP5
7. 카테고리 지정 시 **해당 분류 내 재정규화** TOP5
8. 분류 제품 수 &lt; 5 → `lowSampleWarning` 플래그
9. 추천 이유 문구 생성 (임계값 미충족 시 기본 문구)

결측 항목: 해당 항목 점수 0, 응답/UI는 "정보 없음"

---

### Phase C — 백엔드: FastAPI 엔드포인트

기존 `main.py`의 CORS·engine·lifespan은 유지하고, 라우터/서비스를 추가한다.

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/health` | 기존 유지 |
| GET | `/api/goals` | 건강 목표 목록 |
| GET | `/api/categories` | DB 식품분류 동적 목록 |
| GET | `/api/recommendations?goal=&category=` | TOP5 (category 옵션) |
| GET | `/api/products/{id}?goal=&category=` | 상세 + 점수 + 이유 + 차트용 평균 |
| GET | `/api/search?q=&category=` | 식품명 검색 (공백·대소문자 무시) |

런타임에는 공공 API를 호출하지 않는다.

---

### Phase D — 프론트엔드: 공통 기반

기존 Vite React 위에 NutriPick UI를 올린다. (scaffold 재생성 없음)

1. 라우팅 (`/`, `/recommend`, `/products/:id`, `/search`)
2. API 클라이언트 확장 (`frontend/src/api.js` 기반)
3. 공통 컴포넌트: Header, Button, Badge, Spinner, Empty/Error
4. 디자인 토큰 반영 (`DESIGM_SYSTEM.md` / `UI_GUIDE.md` 색·여백)
5. 필요 시 Tailwind, Lucide, Chart.js, react-router 추가

참고 UI: `docs/reference/main.png`, `recommend.png`, `detail.png`

---

### Phase E — 프론트엔드: 홈 (건강 목표 선택)

1. Hero 섹션
2. 목표 카드 4종 (다이어트 / 고단백 / 저염식 / 저당식)
3. 선택 상태 + "추천받기" → 추천 페이지 이동

---

### Phase F — 프론트엔드: 추천 결과

1. 선택한 목표 배너
2. 식품분류 칩 (클릭 시 TOP5 재요청)
3. TOP5 카드 (제품명, 분류, 칼로리, 단백질, 점수)
4. 표본 부족·점수 안내 문구
5. 카드 클릭 → 상세 이동

---

### Phase G — 프론트엔드: 제품 상세

1. 제품 요약 (이름, 분류, 제조사, 점수)
2. 영양성분 표 (100g 기준)
3. Chart.js 막대그래프 (칼로리·단백질·지방·당류·나트륨, 가능하면 카테고리 평균 비교)
4. 추천 이유 리스트

---

### Phase H — 프론트엔드: 검색 (MVP 최소)

1. Header 검색 진입
2. 식품명 부분 일치 검색
3. 결과 없음 Empty State  
(검색 자동완성·분류 드롭다운은 MVP에서 축소 가능)

---

### Phase I — MVP 마무리

1. Desktop First + 반응형
2. 접근성 (포커스, 버튼 최소 높이)
3. README: 실행 방법, `.env` 키 설정, 데이터 수집 방법
4. 스모크 테스트: 목표 → 추천 → 상세 → 검색, 응답 3초 이내

---

## 4. 추가 기능 (MVP 이후)

PRD "첫 출시에서 제외" 및 MVP에서 축소한 항목. **지시가 있기 전까지 구현하지 않는다.**

| 우선 | 항목 | 설명 |
|------|------|------|
| P1 | 검색 식품분류 드롭다운 | 검색창 옆 분류 필터 |
| P1 | 상세 차트 고도화 | 카테고리 평균 비교 고정, 단위 스케일 정리 |
| P2 | 데이터 재수집 UX | 관리용 수동 재수집 트리거/문서화 |
| P2 | 제품 이미지/플레이스홀더 개선 | 참고 UI에 맞춘 썸네일 |
| — | 회원가입 / 로그인 | 제외 |
| — | 즐겨찾기 | 제외 (상세 하트는 비활성 가능) |
| — | 리뷰 / AI 챗봇 / OCR | 제외 |
| — | 식단 기록 / 칼로리 계산기 | 제외 |
| — | 결제 / 쇼핑몰 연동 | 제외 |
| — | 의료적 진단 | 제외 |
| — | 검색 자동완성 | 제외 |

---

## 5. 화면·API 대응

| 화면 | 참고 | 주요 API |
|------|------|----------|
| 홈 | `main.png` | `GET /api/goals` |
| 추천 | `recommend.png` | `GET /api/categories`, `GET /api/recommendations` |
| 상세 | `detail.png` | `GET /api/products/{id}` |
| 검색 | Header | `GET /api/search` |

사용자 흐름: 목표 선택 → (선택적 분류) → TOP5 → 상세 (3클릭 이내)

---

## 6. 작업 진행 방식

1. `docs/TASKS.md`의 체크리스트를 위에서부터 한 항목씩 진행한다.
2. 한 번에 하나의 기능/작업만 구현한다.
3. 완료 후 해당 체크박스를 갱신한다.
4. 백엔드가 동작한 뒤 프론트 화면을 붙인다.
5. 문서 충돌 시 우선순위: **PRD → UI_GUIDE → DESIGN_SYSTEM**

상세 체크리스트: [`docs/TASKS.md`](./TASKS.md)
