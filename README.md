# NutriPick

건강 목표(다이어트 · 고단백 · 저염식 · 저당식)에 맞는 **가공식품 추천 · 비교** 웹 서비스입니다.

식약처 식품영양성분 OpenAPI 데이터를 **1회 수집**해 SQLite에 저장한 뒤, FastAPI가 점수를 계산하고 React가 화면을 제공합니다.  
런타임에는 **SQLite만** 사용하며, 공공 API를 요청마다 호출하지 않습니다.

---

## 주요 기능

- 건강 목표 기반 추천 점수 (Min-Max 정규화 · 목표별 가중치)
- 식품분류 선택 시 **대분류 → 중분류(대표식품명) 2단 필터**
- 추천 목록 페이지네이션 (10개씩)
- 제품 상세: Health Score, 영양 신호등 카드, 막대 차트, 추천 이유
- 제품 검색 (식품명 · 분류 필터, 분류만으로도 조회 가능)
- **제품 비교** (최대 5개): 비교 테이블 · Scatter · Radar(상위 3개 프로필)

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| Frontend | React (Vite) · Tailwind CSS · Chart.js · Lucide · React Router |
| Backend | FastAPI · SQLModel · SQLite |
| Data | 식품의약품안전처 식품영양성분DB OpenAPI ([data.go.kr](https://www.data.go.kr/)) |

---

## 사전 준비

### 1. API 키 (데이터 수집용)

`backend/.env.example`을 복사해 `backend/.env`를 만들고 키를 넣습니다.

```bat
cd backend
copy .env.example .env
```

```env
DATA_GO_KR_SERVICE_KEY=발급받은_serviceKey
```

- 키는 **코드에 하드코딩하지 마세요.**
- `.env`는 gitignore 대상입니다. 커밋하지 마세요.
- 프론트엔드에는 키를 두지 않습니다. (백엔드 수집 스크립트만 사용)

### 2. 백엔드 가상환경

이미 `backend/venv`가 있으면 생략합니다.

```bat
cd backend
python -m venv venv
venv\Scripts\activate.bat
pip install -r requirements.txt
```

PowerShell:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 3. 프론트 의존성

```bat
cd frontend
npm install
```

---

## 데이터 수집

서비스 실행 전에 SQLite(`backend/app.db`)에 데이터를 적재하세요.

```bat
cd backend
venv\Scripts\activate.bat

REM 1페이지(약 100건) 스모크
python -m scripts.collect_foods

REM 전체 수집 (시간이 오래 걸릴 수 있음)
python -m scripts.collect_foods --all
```

- 필드 매핑: `docs/FIELD_MAPPING.md`, `docs/API.md`
- 수집 실패 시 최대 3회 재시도 후 해당 페이지를 스킵합니다.

---

## 실행

**터미널 1 — 백엔드**

```bat
cd backend
venv\Scripts\activate.bat
uvicorn main:app --reload
```

- Health: http://127.0.0.1:8000/health  
- Swagger: http://127.0.0.1:8000/docs  

**터미널 2 — 프론트**

```bat
cd frontend
npm run dev
```

- App: http://localhost:5173  
  (포트가 사용 중이면 Vite가 `5174`, `5175` 등을 안내합니다. 터미널에 나온 Local URL을 사용하세요.)

---

## 화면 흐름

1. **홈** — 건강 목표 선택 → 추천받기  
2. **추천 결과** — 대/중분류 칩 · 점수순 목록(페이지당 10개) · 비교용 체크(최대 5개)
3. **제품 상세** — Health Score · 영양 카드 · 차트 · 추천 이유  
4. **검색** — 식품명/분류 검색 · 결과에서도 비교 선택 가능  
5. **비교** (`/compare`) — 테이블 · Scatter(목표 축) · Radar(상위 3개 프로필)

---

## 주요 API

| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/goals` | 건강 목표 목록 |
| GET | `/api/categories` | 대분류·중분류 계층 목록 |
| GET | `/api/recommendations?goal=&category=&category2=&page=&pageSize=` | 추천 목록 (기본 pageSize=10) |
| GET | `/api/products/{id}?goal=&category=&category2=` | 제품 상세 |
| GET | `/api/search?q=&category=` | 식품명 검색 (q 또는 category 중 하나 이상) |

`goal` 값: `diet` | `high_protein` | `low_sodium` | `low_sugar`

---

## 프로젝트 구조

```
food_recommend/
├── backend/
│   ├── main.py                 # FastAPI 엔드포인트
│   ├── models.py               # Product SQLModel
│   ├── services/recommendation.py
│   ├── scripts/collect_foods.py
│   ├── .env.example
│   └── app.db                  # 수집 후 생성 (gitignore)
├── frontend/
│   └── src/
│       ├── pages/              # Home, Recommend, Detail, Search, Compare
│       ├── components/
│       ├── api.js
│       └── utils/
└── docs/                       # PRD, UI, TASKS 등
```

---

## 문서

| 문서 | 내용 |
|------|------|
| `docs/PRD.md` | 요구사항 · 추천 알고리즘 |
| `docs/UI_GUIDE.md` | UI 가이드 |
| `docs/DESIGM_SYSTEM.md` | 디자인 시스템 (참고) |
| `docs/TASKS.md` | 작업 체크리스트 |
| `docs/DEVELOPMENT_PLAN.md` | 개발 계획 |
| `docs/FIELD_MAPPING.md` | API ↔ DB 필드 매핑 |
| `docs/API.md` | 공공 API 필드 참고 |

---

## 참고

- 추천 점수는 영양성분 기반 규칙 점수이며, 의료적 진단이 아닙니다.
- 제품 패키지 사진은 공공 API에 없어, 분류·키워드 기반 일러스트를 사용합니다.
- 회원가입 · 즐겨찾기 · 결제 등은 MVP 범위에서 제외되어 있습니다.
"# food_recommend" 
