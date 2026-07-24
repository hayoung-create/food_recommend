# 공공 API → Product 필드 매핑표

기준: 식약처 식품영양성분DB OpenAPI (`getFoodNtrCpntDbInfo02`)  
확인 방법: `.env`의 `DATA_GO_KR_SERVICE_KEY`로 1페이지 샘플 호출 (`numOfRows=100`)

## API 응답 구조

```
{ "header": { "resultCode", "resultMsg" }, "body": { "pageNo", "totalCount", "numOfRows", "items": [ ... ] } }
```

- 정상: `header.resultCode == "00"`
- `items`가 단일 object일 수 있으므로 list로 정규화 필요

## Product 컬럼 매핑

| Product 컬럼 | API 필드 | 비고 |
|--------------|----------|------|
| `food_cd` | `FOOD_CD` | unique 키 (upsert용) |
| `name` | `FOOD_NM_KR` | 식품명 |
| `category` | `FOOD_CAT1_NM` | 식품대분류 (밥류, 면 및 만두류 등) |
| `category2` | `FOOD_REF_NM` | 대표식품명 — UI 중분류 칩 (김밥, 국밥, 덮밥 등). `FOOD_CAT2_NM`은 토핑/세부 변형에 가까워 중분류로 부적합 |

| `maker` | `MAKER_NM` | 필드 존재. 품목대표는 자주 null → UI "정보 없음" |
| `serving_size` | `SERVING_SIZE` | 샘플 기준 대부분 `100g` |
| `calories` | `AMT_NUM1` | 에너지(kcal) |
| `protein` | `AMT_NUM3` | 단백질(g) |
| `fat` | `AMT_NUM4` | 지방(g) |
| `carb` | `AMT_NUM6` | 탄수화물(g) |
| `sugar` | `AMT_NUM7` | 당류(g) |
| `sodium` | `AMT_NUM13` | 나트륨(mg) |
| `cholesterol` | `AMT_NUM23` | 콜레스테롤(mg) |
| `saturated_fat` | `AMT_NUM24` | 포화지방산(g) |

## 제조사 (`MAKER_NM`)

- 응답 키에 `MAKER_NM` **존재**
- 품목대표 위주 조회 시 값이 비어 있는 경우가 많음
- 상용제품/`MAKER_NM` 검색 시에는 값이 채워짐
- MVP: `maker ← MAKER_NM`, 없으면 `null`

## 전처리 정책

- 영양 문자열 → `float`, 실패/빈값 → `null`
- 결측 행도 **제외하지 않음**
- `SERVING_SIZE`가 100g/100ml가 아니면 경고 로그 후 행 유지
