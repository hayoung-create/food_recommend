# UI Guide
Project: NutriPick
Version: MVP 1.0

---

# UI Concept

NutriPick는 건강 목표 기반 가공식품 추천 서비스이다.

UI는 쇼핑몰처럼 보이면 안 되며,
의료 서비스처럼 너무 딱딱해서도 안 된다.

다음 서비스들의 분위기를 참고한다.

- Samsung Health
- Apple Health
- MyFitnessPal

키워드

- Clean
- Healthy
- Minimal
- Modern
- Friendly

---

# Color

Primary

#16A34A

Secondary

#DCFCE7

Background

#F8FAFC

Card

#FFFFFF

Border

#E2E8F0

Text

#1E293B

Sub Text

#64748B

Success

#22C55E

Warning

#F59E0B

Danger

#EF4444

---

# Font

Pretendard

Title
700

Subtitle
600

Body
400

---

# Radius

Card

16px

Button

12px

Input

12px

---

# Shadow

Soft Shadow Only

box-shadow:

0 4px 12px rgba(0,0,0,.06)

강한 그림자는 사용하지 않는다.

---

# Layout

Desktop First

Max Width

1200px

Content

Center

여백은 충분히 사용한다.

답답하게 배치하지 않는다.

---

# Header

좌측

🥗 NutriPick 로고

우측

검색 버튼

Header는 항상 고정된다.

높이

72px

Background

White

---

# Main Screen

상단

Hero Section

좌측

큰 제목

건강 목표에 맞는
가공식품을 추천받아보세요.

아래

간단한 설명

우측

건강한 음식 일러스트

(샐러드 또는 과일)

---

그 아래

Goal Selection

4개의 카드

카드 크기

약 120px

아이콘

Lucide React

다이어트

🥗

고단백

💪

저염식

🧂

저당식

🍬

Hover

살짝 확대

Selected

초록색 Border

---

추천받기 버튼

Primary Color

Green

Width

100%

Height

56px

Radius

12px

---

# Recommendation Page

상단

선택한 목표

Badge

예

다이어트

TOP5 추천

Vertical Card

각 카드

제품 이미지

제품명

식품분류

칼로리

단백질

추천점수

상세보기 버튼

Hover

Card Lift

추천점수

큰 글씨

초록색

---

# Detail Page

상단

제품명

식품분류

추천 Badge

추천 점수

---

Section 1

영양성분

Table

칼로리

탄수화물

단백질

지방

당류

나트륨

포화지방

콜레스테롤

---

Section 2

Nutrition Chart

Chart.js

Bar Chart

항목

칼로리

단백질

지방

당류

나트륨

Primary Green 사용

---

Section 3

추천 이유

Check Icon

예시

✔ 단백질 함량이 높습니다.

✔ 지방 함량이 낮습니다.

✔ 다이어트에 적합합니다.

흰색 카드 안에 표시한다.

---

# Search

상단 Header

Search Icon

클릭

검색창

자동완성

제품명 검색 가능

---

# Card Style

White

Radius

16px

Padding

20px

Soft Shadow

Hover Animation

Scale 1.02

Transition

0.2s

---

# Buttons

Primary

Green

Secondary

White

Border Green

Hover

살짝 어두운 Green

---

# Icons

Lucide React

Search

Heart

Apple

Salad

Dumbbell

Chart

Arrow Right

Chevron Left

Info

Check

---

# Animation

Fade In

Hover Scale

Card Lift

Smooth Transition

Duration

0.2 ~ 0.3s

과한 애니메이션은 사용하지 않는다.

---

# Responsive

Desktop

2 Columns

Tablet

1~2 Columns

Mobile

Single Column

Card Width

100%

---

# UX Principle

사용자는

3번 이하의 클릭으로

추천 결과를 확인할 수 있어야 한다.

정보는 많지만

복잡하게 느껴지지 않아야 한다.

영양성분은 숫자보다

그래프로 먼저 이해할 수 있도록 한다.

추천 이유는 반드시 함께 제공한다.

---

# Design Rules

절대 쇼핑몰처럼 만들지 않는다.

과도한 그라데이션 사용 금지

다크모드 제외

네온 컬러 사용 금지

과도한 그림자 금지

복잡한 메뉴 금지

항상 White + Green 중심

UI는 심플하고 신뢰감 있게 구현한다.

---

# Reference Image

프로젝트에 첨부된

main.png

recommend.png

detail.png

세 개의 화면을 최대한 동일하게 구현한다.

레이아웃

여백

폰트 크기

카드 디자인

색상

컴포넌트 위치를
가능한 한 동일하게 구현한다.