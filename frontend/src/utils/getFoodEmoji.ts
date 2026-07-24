const foodEmojiMap: ReadonlyArray<{ keyword: string; emoji: string }> = [
  { keyword: '볶음밥', emoji: '🍛' },
  { keyword: '잡채밥', emoji: '🍛' },
  { keyword: '카레라이스', emoji: '🍛' },
  { keyword: '하이라이스', emoji: '🍛' },
  { keyword: '오므라이스', emoji: '🍛' },

  { keyword: '김밥', emoji: '🍙' },
  { keyword: '주먹밥', emoji: '🍙' },
  { keyword: '초밥', emoji: '🍣' },
  { keyword: '국밥', emoji: '🍲' },

  { keyword: '떡만두국', emoji: '🥟' },
  { keyword: '떡국', emoji: '🥣' },

  { keyword: '냉면', emoji: '🥣' },
  { keyword: '자장', emoji: '🍜' },
  { keyword: '라면', emoji: '🍜' },
  { keyword: '국수', emoji: '🍜' },
  { keyword: '우동', emoji: '🍜' },

  { keyword: '낙지', emoji: '🐙' },
  { keyword: '오징어', emoji: '🦑' },
  { keyword: '새우', emoji: '🍤' },
  { keyword: '참치', emoji: '🐟' },
  { keyword: '생선', emoji: '🐟' },

  { keyword: '샌드위치', emoji: '🥪' },
  { keyword: '닭', emoji: '🍗' },
  { keyword: '치킨', emoji: '🍗' },
  { keyword: '불고기버거', emoji: '🍔' },
  { keyword: '햄버거', emoji: '🍔' },
  { keyword: '소고기', emoji: '🥩' },
  { keyword: '돼지고기', emoji: '🥩' },
  { keyword: '고기', emoji: '🥩' },

  { keyword: '계란', emoji: '🥚' },
  { keyword: '우유', emoji: '🥛' },
  { keyword: '두부', emoji: '⬜' },
  { keyword: '콩', emoji: '🫘' },
  { keyword: '깨', emoji: '🌾' },

  { keyword: '김치', emoji: '🥬' },
  { keyword: '채소', emoji: '🥬' },
  { keyword: '야채', emoji: '🥬' },

  { keyword: '사과', emoji: '🍎' },
  { keyword: '바나나', emoji: '🍌' },

  { keyword: '쑥절편', emoji: '🍡' },
  { keyword: '백설기', emoji: '🍡' },
  { keyword: '절편', emoji: '🍡' },
  { keyword: '증편', emoji: '🍡' },
  { keyword: '약식', emoji: '🍘' },
  { keyword: '인절미', emoji: '🍡' },
  { keyword: '송편', emoji: '🍡' },
  { keyword: '떡', emoji: '🍡' },

  { keyword: '피자빵', emoji: '🍕' },
  { keyword: '피자', emoji: '🍕' },

  { keyword: '롤케이크', emoji: '🍰' },
  { keyword: '케이크', emoji: '🎂' },
  { keyword: '카스텔라', emoji: '🍰' },

  { keyword: '크로와상', emoji: '🥐' },
  { keyword: '크루아상', emoji: '🥐' },
  { keyword: '페이스트리', emoji: '🥐' },

  { keyword: '베이글', emoji: '🥯' },

  { keyword: '도넛', emoji: '🍩' },
  { keyword: '도너츠', emoji: '🍩' },

  { keyword: '츄러스', emoji: '🥖' },

  { keyword: '마늘빵', emoji: '🥖' },
  { keyword: '모닝빵', emoji: '🍞' },
  { keyword: '모카빵', emoji: '🍞' },
  { keyword: '식빵', emoji: '🍞' },
  { keyword: '소보로빵', emoji: '🍞' },
  { keyword: '초코소라빵', emoji: '🍞' },
  { keyword: '머핀', emoji: '🧁' },

  { keyword: '빵', emoji: '🍞' },
  { keyword: '음료', emoji: '🧃' },

  { keyword: '밥', emoji: '🍚' },
]

const DEFAULT_FOOD_EMOJI = '📦'

/**
 * 식품명 키워드로 대표 이모지를 반환한다.
 * 구체적 음식 → 일반 키워드 순으로 검사한다.
 */
export function getFoodEmoji(foodName: string): string {
  const name = foodName ?? ''

  for (const { keyword, emoji } of foodEmojiMap) {
    if (name.includes(keyword)) {
      return emoji
    }
  }

  return DEFAULT_FOOD_EMOJI
}
