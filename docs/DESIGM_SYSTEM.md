# DESIGN SYSTEM
Project: NutriPick
Version: MVP 1.0

---

# Design Philosophy

NutriPick는 건강 목표 기반 가공식품 추천 서비스이다.

디자인은 다음과 같은 이미지를 전달해야 한다.

- 건강함
- 신뢰감
- 깔끔함
- 직관적
- 데이터 중심

쇼핑몰처럼 보이면 안 되며,
의료 서비스처럼 딱딱해서도 안 된다.

참고 서비스

- Samsung Health
- Apple Health
- MyFitnessPal

---

# Color Palette

## Primary

Green 600

HEX

#16A34A

용도

- Primary Button
- Selected Card
- Chart Highlight
- Badge

---

## Secondary

Green 100

HEX

#DCFCE7

용도

- Selected Background
- Info Box

---

## Background

Slate 50

HEX

#F8FAFC

페이지 전체 배경

---

## Card

White

HEX

#FFFFFF

모든 Card 배경

---

## Border

Slate 200

HEX

#E2E8F0

---

## Text Primary

Slate 800

HEX

#1E293B

---

## Text Secondary

Slate 500

HEX

#64748B

---

## Success

Green 500

HEX

#22C55E

---

## Warning

Amber 500

HEX

#F59E0B

---

## Danger

Red 500

HEX

#EF4444

---

# Typography

Font

Pretendard

Fallback

sans-serif

---

Display

36px

Bold

---

H1

30px

Bold

---

H2

24px

Bold

---

H3

20px

SemiBold

---

Body

16px

Regular

---

Caption

14px

Regular

Color

Slate500

---

# Layout

Desktop First

Maximum Width

1200px

Content

Centered

Page Padding

32px

Section Gap

48px

Card Gap

24px

---

# Grid

Desktop

12 Columns

Tablet

6 Columns

Mobile

1 Column

---

# Radius

Card

16px

Button

12px

Input

12px

Badge

999px

---

# Shadow

Card

0 4px 12px rgba(0,0,0,.06)

Hover

0 8px 24px rgba(0,0,0,.08)

강한 그림자 사용 금지

---

# Header

Height

72px

Background

White

Border Bottom

1px

Logo

좌측

Search

우측

Sticky Header

사용

---

# Buttons

## Primary Button

Background

Primary Green

Text

White

Height

56px

Radius

12px

Hover

Primary보다 약간 어둡게

Transition

0.2s

---

## Secondary Button

White

Border

Primary Green

Text

Primary Green

---

# Cards

Background

White

Radius

16px

Padding

20px

Shadow

Soft

Hover

Scale

1.02

Transition

0.2s

---

# Goal Card

아이콘

상단 좌측

제목

Bold

설명

Caption

Hover

Border Green

Selected

Background

Light Green

Border

Primary Green

---

# Recommendation Card

구성

제품 이미지

↓

제품명

↓

식품분류

↓

영양정보

↓

추천점수

↓

상세보기

추천점수

큰 글씨

Primary Green

---

# Badge

Radius

999px

Padding

6px 12px

Primary Green

White Text

예시

다이어트

추천

TOP5

---

# Nutrition Table

2 Columns

항목

왼쪽

값

오른쪽

단위 표시

예시

120 kcal

24 g

320 mg

---

# Chart

Chart.js

Bar Chart

Primary Color

Green

비교 대상

Gray

Grid

Light Gray

Legend

Bottom

Animation

Enabled

---

# Icons

Lucide React

사용 아이콘

Apple

Salad

Beef

Search

ArrowRight

ChevronLeft

ChartColumn

HeartPulse

Dumbbell

Info

CircleCheck

BadgeAlert

---

# Animation

Fade In

Duration

0.3s

Hover Scale

1.02

Button Hover

0.2s

Page Transition

Fade

과한 애니메이션 사용 금지

---

# Responsive

Desktop

2 Columns

Tablet

1~2 Columns

Mobile

Single Column

모든 버튼은

Width 100%

---

# Empty State

아이콘

SearchX

문구

검색 결과가 없습니다.

또는

조건에 맞는 제품이 없습니다.

---

# Loading

Spinner

Primary Green

문구

추천 제품을 찾고 있습니다...

---

# Error

Red Border

Error Icon

Retry Button

---

# Accessibility

Color Contrast

WCAG AA 이상

Button Height

최소 44px

키보드 탐색 가능

Focus Ring 표시

---

# UX Principles

1.

사용자는

3번 이하의 클릭으로

추천 결과를 확인할 수 있어야 한다.


2.

영양성분은

숫자보다

그래프로 먼저 이해할 수 있게 한다.

3.

모든 페이지는

동일한 여백과 카드 스타일을 사용한다.

4.

복잡한 기능보다

직관성을 우선한다.

---

# Design Rules

반드시

White + Green 중심

쇼핑몰처럼 구현하지 않는다.

다크모드 제외

과도한 Gradient 사용 금지

Glassmorphism 사용 금지

Neon Color 사용 금지

과한 Shadow 사용 금지

복잡한 메뉴 사용 금지

Bootstrap 스타일 금지

깔끔하고 현대적인 Healthcare App 스타일을 유지한다.

---

# Reference

반드시 reference 폴더의

- main.png
- recommend.png
- detail.png

를 기준으로 UI를 구현한다.

레이아웃,
간격,
색상,
버튼,
카드 디자인을
최대한 동일하게 구현한다.