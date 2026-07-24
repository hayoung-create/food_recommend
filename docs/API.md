# 요청URL

- https://apis.data.go.kr/1471000/FoodNtrCpntDbInfo02/getFoodNtrCpntDbInq02?serviceKey=db20c698a11dfc09c395219bd220b166607ecb6296bb0387db0b9e88a4bfb55b&type=json

## 요청변수
# API 요청 파라미터

| 파라미터 | 타입 | 필수 여부 | 설명 | 예시 |
|----------|------|----------|------|------|
| serviceKey | string | ✅ 필수 | 공공데이터포털에서 발급받은 인증키 | YOUR_SERVICE_KEY |
| pageNo | integer | 선택 | 페이지 번호 | 1 |
| numOfRows | integer | 선택 | 한 페이지 결과 수 | 100 |
| type | string | 선택 | 응답 데이터 형식 (xml/json), 기본값: xml | json |
| FOOD_NM_KR | string | 선택 | 식품명 | 닭가슴살 |
| RESEARCH_YMD | string | 선택 | 데이터 생성일자 | 20240101 |
| MAKER_NM | string | 선택 | 업체명 | CJ제일제당 |
| FOOD_CAT1_NM | string | 선택 | 식품대분류명 | 즉석조리식품 |
| ITEM_REPORT_NO | string | 선택 | 품목제조보고번호 | 202300000001 |
| UPDATE_DATE | string | 선택 | 데이터 수정일자 | 20240115 |
| DB_CLASS_NM | string | 선택 | 품목대표/상품제품 | 대표제품 |


## 출력변수
## 응답 필드 명세 (Response Body)

### 1. 기본 및 분류 정보
| 필드명 (Field Name) | 설명 (Description) | 타입 (Type) | 구분 (Required) |
| :--- | :--- | :--- | :--- |
| `NUM` | 번호 | String | 옵션 |
| `FOOD_CD` | 식품코드 | String | 옵션 |
| `FOOD_NM_KR` | 식품명 | String | 옵션 |
| `DB_GRP_CM` | 데이터구분코드 | String | 옵션 |
| `DB_GRP_NM` | 데이터구분명 | String | 옵션 |
| `DB_CLASS_CM` | 품목대표/상용제품 코드 | String | 옵션 |
| `DB_CLASS_NM` | 품목대표/상용제품 | String | 옵션 |
| `FOOD_OR_CD` | 식품기원코드 | String | 옵션 |
| `FOOD_OR_NM` | 식품기원명 | String | 옵션 |
| `FOOD_CAT1_CD` | 식품대분류코드 | String | 옵션 |
| `FOOD_CAT1_NM` | 식품대분류명 | String | 옵션 |
| `FOOD_REF_CD` | 대표식품코드 | String | 옵션 |
| `FOOD_REF_NM` | 대표식품명 | String | 옵션 |
| `FOOD_CAT2_CD` | 식품중분류코드 | String | 옵션 |
| `FOOD_CAT2_NM` | 식품중분류명 | String | 옵션 |
| `FOOD_CAT3_CD` | 식품소분류코드 | String | 옵션 |
| `FOOD_CAT3_NM` | 식품소분류명 | String | 옵션 |
| `FOOD_CAT4_CD` | 식품세분류코드 | String | 옵션 |
| `FOOD_CAT4_NM` | 식품세분류명 | String | 옵션 |
| `SERVING_SIZE` | 영양성분함량기준량 | String | 옵션 |

### 2. 영양성분 정보
| 필드명 (Field Name) | 설명 (Description) | 타입 (Type) | 구분 (Required) |
| :--- | :--- | :--- | :--- |
| `AMT_NUM1` | 에너지(kcal) | String | 옵션 |
| `AMT_NUM2` | 수분(g) | String | 옵션 |
| `AMT_NUM3` | 단백질(g) | String | 옵션 |
| `AMT_NUM4` | 지방(g) | String | 옵션 |
| `AMT_NUM5` | 회분(g) | String | 옵션 |
| `AMT_NUM6` | 탄수화물(g) | String | 옵션 |
| `AMT_NUM7` | 당류(g) | String | 옵션 |
| `AMT_NUM8` | 식이섬유(g) | String | 옵션 |
| `AMT_NUM9` | 칼슘(mg) | String | 옵션 |
| `AMT_NUM10` | 철(mg) | String | 옵션 |
| `AMT_NUM11` | 인(mg) | String | 옵션 |
| `AMT_NUM12` | 칼륨(mg) | String | 옵션 |
| `AMT_NUM13` | 나트륨(mg) | String | 옵션 |
| `AMT_NUM14` | 비타민 A(μg RAE) | String | 옵션 |
| `AMT_NUM15` | 비타민 A(μg) | String | 옵션 |
| `AMT_NUM16` | 레티놀(μg) | String | 옵션 |
| `AMT_NUM17` | 베타카로틴(μg) | String | 옵션 |
| `AMT_NUM18` | 비타민 B1(mg) | String | 옵션 |
| `AMT_NUM19` | 비타민 B2(mg) | String | 옵션 |
| `AMT_NUM20` | 니아신(mg) | String | 옵션 |
| `AMT_NUM21` | 비타민 C(mg) | String | 옵션 |
| `AMT_NUM22` | 비타민 D(μg) | String | 옵션 |
| `AMT_NUM23` | 콜레스테롤(mg) | String | 옵션 |
| `AMT_NUM24` | 포화지방산(g) | String | 옵션 |
| `AMT_NUM25` | 트랜스지방산(g) | String | 옵션 |
| `AMT_NUM26` | 니코틴산 (mg) | String | 옵션 |
| `AMT_NUM27` | 니코틴아마이드(mg) | String | 옵션 |
| `AMT_NUM28` | 비오틴(μg) | String | 옵션 |
| `AMT_NUM29` | 비타민 B6 (mg) | String | 옵션 |
| `AMT_NUM30` | 비타민 B12(μg) | String | 옵션 |
| `AMT_NUM31` | 엽산(DFE)(㎍) | String | 옵션 |
| `AMT_NUM32` | 콜린(mg) | String | 옵션 |
| `AMT_NUM33` | 판토텐산(mg) | String | 옵션 |
| `AMT_NUM34` | 비타민 D2(μg) | String | 옵션 |
| `AMT_NUM35` | 비타민 D3(μg) | String | 옵션 |
| `AMT_NUM36` | 비타민 E(mg α-TE) | String | 옵션 |
| `AMT_NUM37` | 비타민 E(mg) | String | 옵션 |
| `AMT_NUM38` | 토코페롤(㎎) | String | 옵션 |
| `AMT_NUM39` | 알파 토코페롤(mg) | String | 옵션 |
| `AMT_NUM40` | 베타 토코페롤(mg) | String | 옵션 |
| `AMT_NUM41` | 감마 토코페롤(mg) | String | 옵션 |
| `AMT_NUM42` | 델타 토코페롤(mg) | String | 옵션 |
| `AMT_NUM43` | 토코트리에놀(㎎) | String | 옵션 |
| `AMT_NUM44` | 알파 토코트리에놀(mg) | String | 옵션 |
| `AMT_NUM45` | 베타 토코트리에놀(mg) | String | 옵션 |
| `AMT_NUM46` | 감마 토코트리에놀(mg) | String | 옵션 |
| `AMT_NUM47` | 델타 토코트리에놀(mg) | String | 옵션 |
| `AMT_NUM48` | 비타민 K(μg) | String | 옵션 |
| `AMT_NUM49` | 비타민 K1(μg) | String | 옵션 |
| `AMT_NUM50` | 비타민 K2(μg) | String | 옵션 |
| `AMT_NUM51` | 갈락토오스(g) | String | 옵션 |
| `AMT_NUM52` | 과당(g) | String | 옵션 |
| `AMT_NUM53` | 당알콜(g) | String | 옵션 |
| `AMT_NUM54` | 맥아당(g) | String | 옵션 |
| `AMT_NUM55` | 알룰로오스(g) | String | 옵션 |
| `AMT_NUM56` | 에리스리톨(g) | String | 옵션 |
| `AMT_NUM57` | 유당(g) | String | 옵션 |
| `AMT_NUM58` | 자당(g) | String | 옵션 |
| `AMT_NUM59` | 타가토스(g) | String | 옵션 |
| `AMT_NUM60` | 포도당(g) | String | 옵션 |
| `AMT_NUM61` | 총 불포화지방산(g) | String | 옵션 |
| `AMT_NUM62` | EPA와 DHA의 합(mg) | String | 옵션 |
| `AMT_NUM63` | 가돌레산/에이코센산(mg) | String | 옵션 |
| `AMT_NUM64` | 감마 리놀렌산(18:3 n-6)(mg) | String | 옵션 |
| `AMT_NUM65` | 네르본산(24:1)(mg) | String | 옵션 |
| `AMT_NUM66` | 도코사디에노산(22:2)(mg) | String | 옵션 |
| `AMT_NUM67` | 도코사펜타에노산(22:5(n-3))(mg) | String | 옵션 |
| `AMT_NUM68` | 도코사펜타엔산(n-6) (22:5,n-6)(mg) | String | 옵션 |
| `AMT_NUM69` | 도코사헥사에노산(22:6(n-3))(mg) | String | 옵션 |
| `AMT_NUM70` | 디호모리놀렌산(20:3(n-3))(mg) | String | 옵션 |
| `AMT_NUM71` | 디호모감마리놀렌산(20:3,n-6))(mg) | String | 옵션 |
| `AMT_NUM72` | 라우르산(12:0)(mg) | String | 옵션 |
| `AMT_NUM73` | 리그노세르산(24:0)(mg) | String | 옵션 |
| `AMT_NUM74` | 리놀레산(18:2(n-6)c)(g) | String | 옵션 |
| `AMT_NUM75` | 리놀레산(18:2(n-6)c)(mg) | String | 옵션 |
| `AMT_NUM76` | 미리스톨레산(14:1)(mg) | String | 옵션 |
| `AMT_NUM77` | 미리스트산(14:0)(mg) | String | 옵션 |
| `AMT_NUM78` | 박센산(18:1(n-7))(mg) | String | 옵션 |
| `AMT_NUM79` | 베헨산(22:0)(mg) | String | 옵션 |
| `AMT_NUM80` | 부티르산(4:0)(mg) | String | 옵션 |
| `AMT_NUM81` | 스테아르산(18:0)(mg) | String | 옵션 |
| `AMT_NUM82` | 스테아리돈산(18:4)(mg) | String | 옵션 |
| `AMT_NUM83` | 아라키돈산(20:4 n-6)(mg) | String | 옵션 |
| `AMT_NUM84` | 아라키드산(20:0)(mg) | String | 옵션 |
| `AMT_NUM85` | 알파 리놀렌산(18:3(n-3))(g) | String | 옵션 |
| `AMT_NUM86` | 알파 리놀렌산(18:3(n-3))(mg) | String | 옵션 |
| `AMT_NUM87` | 에루크산(22:1)(mg) | String | 옵션 |
| `AMT_NUM88` | 에이코사디에노산(20:2(n-6))(mg) | String | 옵션 |
| `AMT_NUM89` | 에이코사트리에노산(20:3(n-6))(mg) | String | 옵션 |
| `AMT_NUM90` | 에이코사펜타에노산(20:5(n-3))(mg) | String | 옵션 |
| `AMT_NUM91` | 오메가3 지방산(g) | String | 옵션 |
| `AMT_NUM92` | 오메가6 지방산(g) | String | 옵션 |
| `AMT_NUM93` | 올레산(18:1 n-9)(mg) | String | 옵션 |
| `AMT_NUM94` | 카프로산(6:0)(mg) | String | 옵션 |
| `AMT_NUM95` | 카프르산(10:0)(mg) | String | 옵션 |
| `AMT_NUM96` | 카프릴산(8:0)(mg) | String | 옵션 |
| `AMT_NUM97` | 트라이데칸산(13:0)(mg) | String | 옵션 |
| `AMT_NUM98` | 트랜스 리놀레산(18:2t)(mg) | String | 옵션 |
| `AMT_NUM99` | 트랜스 리놀렌산(18:3t)(mg) | String | 옵션 |
| `AMT_NUM100` | 카페인(㎎) | String | 옵션 |
| `AMT_NUM101` | 트랜스 올레산(18:1(n-9)t)(mg) | String | 옵션 |
| `AMT_NUM102` | 트리코산산(23:0)(mg) | String | 옵션 |
| `AMT_NUM103` | 팔미톨레산(16:1)(mg) | String | 옵션 |
| `AMT_NUM104` | 팔미트산(16:0)(mg) | String | 옵션 |
| `AMT_NUM105` | 펜타데칸산(15:0)(mg) | String | 옵션 |
| `AMT_NUM106` | 헨에이코산산(21:0)(mg) | String | 옵션 |
| `AMT_NUM107` | 헵타데센산(17:1)(mg) | String | 옵션 |
| `AMT_NUM108` | 헵타데칸산(17:0)(mg) | String | 옵션 |
| `AMT_NUM109` | 구리(㎎) | String | 옵션 |
| `AMT_NUM110` | 구리(μg) | String | 옵션 |
| `AMT_NUM111` | 마그네슘(mg) | String | 옵션 |
| `AMT_NUM112` | 망간(mg) | String | 옵션 |
| `AMT_NUM113` | 몰리브덴(μg) | String | 옵션 |
| `AMT_NUM114` | 불소(mg) | String | 옵션 |
| `AMT_NUM115` | 셀레늄(μg) | String | 옵션 |
| `AMT_NUM116` | 아연(mg) | String | 옵션 |
| `AMT_NUM117` | 염소(mg) | String | 옵션 |
| `AMT_NUM118` | 요오드(μg) | String | 옵션 |
| `AMT_NUM119` | 크롬(μg) | String | 옵션 |
| `AMT_NUM120` | 총 아미노산(mg) | String | 옵션 |
| `AMT_NUM121` | 필수아미노산(mg) | String | 옵션 |
| `AMT_NUM122` | 비필수아미노산(mg) | String | 옵션 |
| `AMT_NUM123` | 글루탐산(mg) | String | 옵션 |
| `AMT_NUM124` | 글리신(mg) | String | 옵션 |
| `AMT_NUM125` | 라이신(mg) | String | 옵션 |
| `AMT_NUM126` | 루신(mg) | String | 옵션 |
| `AMT_NUM127` | 메티오닌(mg) | String | 옵션 |
| `AMT_NUM128` | 발린(mg) | String | 옵션 |
| `AMT_NUM129` | 세린(mg) | String | 옵션 |
| `AMT_NUM130` | 시스테인(mg) | String | 옵션 |
| `AMT_NUM131` | 아르기닌(mg) | String | 옵션 |
| `AMT_NUM132` | 아스파르트산(mg) | String | 옵션 |
| `AMT_NUM133` | 알라닌(mg) | String | 옵션 |
| `AMT_NUM134` | 이소루신(mg) | String | 옵션 |
| `AMT_NUM135` | 타우린(mg) | String | 옵션 |
| `AMT_NUM136` | 트레오닌(mg) | String | 옵션 |
| `AMT_NUM137` | 트립토판(mg) | String | 옵션 |
| `AMT_NUM138` | 티로신(mg) | String | 옵션 |
| `AMT_NUM139` | 페닐알라닌(mg) | String | 옵션 |
| `AMT_NUM140` | 프롤린(mg) | String | 옵션 |
| `AMT_NUM141` | 히스티딘(mg) | String | 옵션 |
| `AMT_NUM142` | 펜타데센산(15:1,n-5)(mg) | String | 옵션 |
| `AMT_NUM143` | 에이코사테트라에노산(20:4(n-3)) | String | 옵션 |
| `AMT_NUM144` | 헤니코사펜타엔산(21:5,n-3)(mg) | String | 옵션 |
| `AMT_NUM145` | 니아신당량(NE) | String | 옵션 |
| `AMT_NUM146` | 수용성 식이섬유(g) | String | 옵션 |
| `AMT_NUM147` | 불용성 식이섬유(g) | String | 옵션 |
| `AMT_NUM148` | 피리독신(mg) | String | 옵션 |
| `AMT_NUM149` | 엽산_식품 엽산(μg) | String | 옵션 |
| `AMT_NUM150` | 엽산_합성 엽산(μg) | String | 옵션 |
| `AMT_NUM151` | 총 필수지방산(g) | String | 옵션 |
| `AMT_NUM152` | 총 단일불포화지방산(g) | String | 옵션 |
| `AMT_NUM153` | 총 다중불포화지방산(g) | String | 옵션 |
| `AMT_NUM154` | 총 지방산(g) | String | 옵션 |
| `AMT_NUM155` | 지방산의 합(g) | String | 옵션 |
| `AMT_NUM156` | 식염상당량(g) | String | 옵션 |
| `AMT_NUM157` | 폐기율(%) | String | 옵션 |

### 3. 출처 및 부가 메타 정보
| 필드명 (Field Name) | 설명 (Description) | 타입 (Type) | 구분 (Required) |
| :--- | :--- | :--- | :--- |
| `SUB_REF_CM` | 출처코드 | String | 옵션 |
| `SUB_REF_NAME` | 출처명 | String | 옵션 |
| `NUTRI_AMOUNT_SERVING` | 1회 섭취참고량 | String | 옵션 |
| `Z10500` | 식품중량 | String | 옵션 |
| `DISH_ONE_SERVING` | 1회분량 참고량 | String | 옵션 |
| `ITEM_REPORT_NO` | 품목제조보고번호 | String | 옵션 |
| `MAKER_NM` | 업체명 | String | 옵션 |
| `IMP_MANUFAC_NM` | 수입업체명 | String | 옵션 |
| `SELLER_MANUFAC_NM` | 유통업체명 | String | 옵션 |
| `IMP_YN` | 수입여부 | String | 옵션 |
| `NATION_CM` | 원산지국코드 | String | 옵션 |
| `NATION_NM` | 원산지국명 | String | 옵션 |
| `CRT_MTH_CD` | 데이터생성방법코드 | String | 옵션 |
| `CRT_MTH_NM` | 데이터생성방법명 | String | 옵션 |
| `RESEARCH_YMD` | 데이터생성일자 | String | 옵션 |
| `UPDATE_DATE` | 데이터수정일자 | String | 옵션 |