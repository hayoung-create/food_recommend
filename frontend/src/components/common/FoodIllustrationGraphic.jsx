/** ?? ??? ?? ???? */

function SvgFrame({ children, title }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      role="img"
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <rect width="64" height="64" rx="16" fill="#E8F5E9" />
      {children}
    </svg>
  )
}

function Chicken() {
  return (
    <SvgFrame title="???">
      <ellipse cx="32" cy="36" rx="16" ry="12" fill="#2E7D32" />
      <circle cx="40" cy="24" r="8" fill="#81C784" />
      <path d="M46 22c3 0 5 2 5 4" stroke="#1B5E20" strokeWidth="2" strokeLinecap="round" />
      <circle cx="43" cy="23" r="1.5" fill="#1F2937" />
    </SvgFrame>
  )
}

function Meat() {
  return (
    <SvgFrame title="??">
      <rect x="16" y="22" width="32" height="22" rx="6" fill="#2E7D32" />
      <rect x="20" y="26" width="24" height="6" rx="2" fill="#E8F5E9" opacity="0.7" />
      <rect x="20" y="36" width="18" height="4" rx="2" fill="#E8F5E9" opacity="0.5" />
    </SvgFrame>
  )
}

function Fish() {
  return (
    <SvgFrame title="??">
      <ellipse cx="30" cy="32" rx="16" ry="10" fill="#2E7D32" />
      <path d="M46 32 L56 24 L56 40 Z" fill="#81C784" />
      <circle cx="22" cy="30" r="2" fill="#1F2937" />
    </SvgFrame>
  )
}

function Tofu() {
  return (
    <SvgFrame title="??">
      <rect x="18" y="20" width="28" height="28" rx="4" fill="#FFFFFF" stroke="#2E7D32" strokeWidth="3" />
      <line x1="32" y1="20" x2="32" y2="48" stroke="#E8F5E9" strokeWidth="2" />
      <line x1="18" y1="34" x2="46" y2="34" stroke="#E8F5E9" strokeWidth="2" />
    </SvgFrame>
  )
}

function Yogurt() {
  return (
    <SvgFrame title="???">
      <path d="M22 18h20l3 8v22a6 6 0 0 1-6 6H25a6 6 0 0 1-6-6V26l3-8z" fill="#2E7D32" />
      <rect x="24" y="14" width="16" height="6" rx="2" fill="#81C784" />
      <ellipse cx="32" cy="36" rx="8" ry="4" fill="#E8F5E9" opacity="0.8" />
    </SvgFrame>
  )
}

function Milk() {
  return (
    <SvgFrame title="???">
      <path d="M26 12h12l4 8v30a4 4 0 0 1-4 4H26a4 4 0 0 1-4-4V20l4-8z" fill="#FFFFFF" stroke="#2E7D32" strokeWidth="2.5" />
      <rect x="28" y="24" width="8" height="14" rx="2" fill="#2E7D32" />
    </SvgFrame>
  )
}

function Noodles() {
  return (
    <SvgFrame title="??">
      <ellipse cx="32" cy="42" rx="18" ry="6" fill="#2E7D32" />
      <path d="M18 28c6 8 10 8 16 0s10-8 16 0" stroke="#81C784" strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M18 34c6 8 10 8 16 0s10-8 16 0" stroke="#1B5E20" strokeWidth="3" strokeLinecap="round" fill="none" />
    </SvgFrame>
  )
}

function Rice() {
  return (
    <SvgFrame title="??">
      <ellipse cx="32" cy="44" rx="18" ry="7" fill="#2E7D32" />
      <path d="M16 40c0-14 8-22 16-22s16 8 16 22" fill="#81C784" />
      <circle cx="26" cy="30" r="2" fill="#E8F5E9" />
      <circle cx="34" cy="26" r="2" fill="#E8F5E9" />
      <circle cx="38" cy="34" r="2" fill="#E8F5E9" />
    </SvgFrame>
  )
}

function Soup() {
  return (
    <SvgFrame title="?·?">
      <path d="M14 30h36v6a14 14 0 0 1-14 14H28A14 14 0 0 1 14 36v-6z" fill="#2E7D32" />
      <ellipse cx="32" cy="30" rx="18" ry="6" fill="#81C784" />
      <path d="M24 22c0-4 3-6 8-6" stroke="#1B5E20" strokeWidth="2" strokeLinecap="round" />
      <path d="M36 20c0-3 2-5 6-5" stroke="#1B5E20" strokeWidth="2" strokeLinecap="round" />
    </SvgFrame>
  )
}

function Bread() {
  return (
    <SvgFrame title="?">
      <ellipse cx="32" cy="36" rx="18" ry="12" fill="#2E7D32" />
      <ellipse cx="32" cy="30" rx="16" ry="10" fill="#81C784" />
      <path d="M22 28c4 2 8 2 12 0M30 32c3 1 6 1 10 0" stroke="#E8F5E9" strokeWidth="2" strokeLinecap="round" />
    </SvgFrame>
  )
}

function Snack() {
  return (
    <SvgFrame title="??·??">
      <rect x="20" y="16" width="24" height="34" rx="4" fill="#2E7D32" />
      <rect x="24" y="22" width="16" height="10" rx="2" fill="#E8F5E9" />
      <circle cx="32" cy="40" r="4" fill="#81C784" />
    </SvgFrame>
  )
}

function Drink() {
  return (
    <SvgFrame title="??">
      <path d="M24 14h16l4 36a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6l4-36z" fill="#2E7D32" />
      <rect x="28" y="8" width="8" height="8" rx="2" fill="#81C784" />
      <path d="M26 28h12" stroke="#E8F5E9" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    </SvgFrame>
  )
}

function Salad() {
  return (
    <SvgFrame title="???">
      <ellipse cx="32" cy="44" rx="16" ry="5" fill="#2E7D32" />
      <circle cx="26" cy="30" r="8" fill="#81C784" />
      <circle cx="38" cy="28" r="9" fill="#2E7D32" />
      <circle cx="32" cy="34" r="7" fill="#1B5E20" />
    </SvgFrame>
  )
}

function Egg() {
  return (
    <SvgFrame title="??">
      <ellipse cx="32" cy="34" rx="12" ry="16" fill="#FFFFFF" stroke="#2E7D32" strokeWidth="3" />
      <circle cx="32" cy="36" r="6" fill="#FFB74D" />
    </SvgFrame>
  )
}

function DefaultFood() {
  return (
    <SvgFrame title="??">
      <circle cx="32" cy="30" r="14" fill="#2E7D32" />
      <path d="M32 18v6M26 22c4 2 8 2 12 0" stroke="#E8F5E9" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="32" cy="48" rx="10" ry="3" fill="#81C784" />
    </SvgFrame>
  )
}

const ILLUSTRATIONS = {
  chicken: Chicken,
  meat: Meat,
  fish: Fish,
  tofu: Tofu,
  yogurt: Yogurt,
  milk: Milk,
  noodles: Noodles,
  rice: Rice,
  soup: Soup,
  bread: Bread,
  snack: Snack,
  drink: Drink,
  salad: Salad,
  egg: Egg,
  default: DefaultFood,
}

export function FoodIllustrationGraphic({ type }) {
  const Comp = ILLUSTRATIONS[type] || ILLUSTRATIONS.default
  return <Comp />
}
