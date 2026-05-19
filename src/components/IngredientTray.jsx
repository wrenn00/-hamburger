// 🧺 상단 재료 트레이 — 카드 가로 나열, 햄스터는 골드 보더

import { useState } from 'react'
import { INGREDIENTS } from '../data/ingredients'
import { useBurgerStore } from '../store/useBurgerStore'

const REGULAR = INGREDIENTS.filter((i) => !i.isHamster)
const HAMSTERS = INGREDIENTS.filter((i) => i.isHamster)

function IngredientCard({ def }) {
  const addIngredient = useBurgerStore((s) => s.addIngredient)
  const [hovered, setHovered] = useState(false)

  const isHam = def.isHamster

  return (
    <div className="relative flex-shrink-0" style={{ width: 78 }}>
      {/* 카드 본체 */}
      <div
        onClick={() => addIngredient(def.id)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="cursor-pointer rounded-2xl flex flex-col items-center justify-center gap-1 select-none transition-all duration-200"
        style={{
          width: 78,
          height: 82,
          background: def.cardBg,
          border: `2px solid ${hovered ? def.cardBorder : def.cardBorder + '88'}`,
          boxShadow: hovered
            ? `0 8px 20px ${def.cardBorder}66, 0 0 0 3px ${def.cardBorder}44`
            : `0 2px 8px rgba(0,0,0,0.08)`,
          transform: hovered ? 'translateY(-8px) scale(1.06)' : 'none',
          // 햄스터 카드: 골드 글로우
          ...(isHam && hovered
            ? { boxShadow: `0 8px 24px #FFD70099, 0 0 0 3px #FFD70066` }
            : {}),
        }}
      >
        {/* 이모지 */}
        <span
          className={`text-2xl leading-none ${isHam && hovered ? 'hamster-wiggle' : ''}`}
          style={{ display: 'block' }}
        >
          {def.emoji}
        </span>
        {/* 이름 */}
        <span
          className="text-center leading-tight px-1"
          style={{
            fontFamily: "'Jua', sans-serif",
            fontSize: 10,
            color: '#5C3A1A',
          }}
        >
          {def.name}
        </span>

        {/* 햄스터 반짝 효과 */}
        {isHam && (
          <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
            <div className="sparkle-sweep" />
          </div>
        )}
      </div>

      {/* 호버 툴팁 */}
      {hovered && (
        <div
          className="absolute left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-xs whitespace-nowrap z-50 pointer-events-none"
          style={{
            bottom: '100%',
            marginBottom: 6,
            background: 'rgba(60,30,0,0.85)',
            color: '#FFF',
            fontFamily: "'Jua', sans-serif",
            backdropFilter: 'blur(4px)',
          }}
        >
          {def.name} 추가 ✨
        </div>
      )}
    </div>
  )
}

export default function IngredientTray() {
  return (
    <div
      className="w-full h-full flex items-center px-5 gap-4 overflow-x-auto"
      style={{
        background: 'rgba(255,252,245,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '2px solid rgba(200,160,80,0.2)',
      }}
    >
      {/* 기본 재료 */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {REGULAR.map((def) => (
          <IngredientCard key={def.id} def={def} />
        ))}
      </div>

      {/* 구분선 */}
      <div
        className="flex-shrink-0 self-stretch flex flex-col items-center justify-center gap-1 px-2"
        style={{ minWidth: 36 }}
      >
        <div className="text-yellow-500 text-lg">✨</div>
        <div
          className="w-0.5 flex-1 rounded-full"
          style={{ background: 'linear-gradient(180deg, transparent, #FFD700, transparent)' }}
        />
        <div className="text-yellow-500 text-lg">✨</div>
      </div>

      {/* 햄스터 재료 */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {HAMSTERS.map((def) => (
          <IngredientCard key={def.id} def={def} />
        ))}
      </div>
    </div>
  )
}
