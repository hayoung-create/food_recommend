/**
 * 식품명·분류 키워드 → 일러스트 키
 * (식약처 API에 이미지가 없어 키워드 매칭 사용)
 */
const KEYWORD_RULES = [
  { keys: ['닭가슴', '치킨', '닭고기', '닭'], image: 'chicken' },
  { keys: ['소시지', '햄', '베이컨', '육가공', '돼지고기', '소고기', '쇠고기'], image: 'meat' },
  { keys: ['생선', '고등어', '참치', '연어', '해물', '수산'], image: 'fish' },
  { keys: ['두부', '콩'], image: 'tofu' },
  { keys: ['요거트', '요구르트', '그릭'], image: 'yogurt' },
  { keys: ['우유', '유제품', '치즈'], image: 'milk' },
  { keys: ['면', '라면', '국수', '만두', '파스타', '우동'], image: 'noodles' },
  { keys: ['밥', '쌀', '죽', '비빔밥'], image: 'rice' },
  { keys: ['국', '탕', '찌개', '스프'], image: 'soup' },
  { keys: ['빵', '케이크', '베이커리'], image: 'bread' },
  { keys: ['과자', '스낵', '칩', '프로틴바', '에너지바'], image: 'snack' },
  { keys: ['음료', '주스', '커피', '차', '스무디'], image: 'drink' },
  { keys: ['샐러드', '채소', '야채'], image: 'salad' },
  { keys: ['계란', '달걀', '에그'], image: 'egg' },
]

export function getFoodIllustrationKey(category, name) {
  const text = `${name || ''} ${category || ''}`.toLowerCase()
  for (const rule of KEYWORD_RULES) {
    if (rule.keys.some((key) => text.includes(key.toLowerCase()))) {
      return rule.image
    }
  }
  return 'default'
}
