import { useState } from 'react'
import { INGREDIENTS } from '../data/ingredients'
import { useBurgerStore } from '../store/useBurgerStore'

const MAX = 15
const REGULAR = INGREDIENTS.filter((i) => !i.isHamster)
const HAMSTERS = INGREDIENTS.filter((i) => i.isHamster)

// ── 개별 재료 카드 ─────────────────────────────────────────────────────────
function IngredientCard({ def, onAdd, disabled }) {
  const [hovered, setHovered] = useState(false)
  const isHam = def.isHamster

  return (
    <div className="relative flex-shrink-0" style={{ width: 78 }}>
      <div
        onClick={disabled ? undefined : () => onAdd(def.id)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="rounded-2xl flex flex-col items-center justify-center gap-1 select-none transition-all duration-200"
        style={{
          width: 78,
          height: 82,
          background: def.cardBg,
          border: `2px solid ${hovered && !disabled ? def.cardBorder : def.cardBorder + '88'}`,
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.35 : 1,
          boxShadow:
            hovered && !disabled
              ? isHam
                ? `0 8px 24px #FFD70099, 0 0 0 3px #FFD70066`
                : `0 8px 20px ${def.cardBorder}66, 0 0 0 3px ${def.cardBorder}44`
              : '0 2px 8px rgba(0,0,0,0.08)',
          transform: hovered && !disabled ? 'translateY(-8px) scale(1.06)' : 'none',
        }}
      >
        <span
          className={`text-2xl leading-none ${isHam && hovered && !disabled ? 'hamster-wiggle' : ''}`}
          style={{ display: 'block' }}
        >
          {def.emoji}
        </span>
        <span
          className="text-center leading-tight px-1"
          style={{ fontFamily: "'Jua', sans-serif", fontSize: 10, color: '#5C3A1A' }}
        >
          {def.name}
        </span>

        {isHam && !disabled && (
          <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
            <div className="sparkle-sweep" />
          </div>
        )}
      </div>

      {/* 툴팁 */}
      {hovered && !disabled && (
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

// ── 트레이 ─────────────────────────────────────────────────────────────────
export default function IngredientTray() {
  const stack       = useBurgerStore((s) => s.stack)
  const addIngredient = useBurgerStore((s) => s.addIngredient)
  const [toast, setToast] = useState(false)

  const isFull = stack.length >= MAX

  const handleAdd = (defId) => {
    if (isFull) {
      if (!toast) {           // 중복 토스트 방지
        setToast(true)
        setTimeout(() => setToast(false), 1400)
      }
      return
    }
    addIngredient(defId)
  }

  return (
    <div className="relative w-full h-full">
      {/* 재료 카드 영역 */}
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
            <IngredientCard key={def.id} def={def} onAdd={handleAdd} disabled={isFull} />
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
            <IngredientCard key={def.id} def={def} onAdd={handleAdd} disabled={isFull} />
          ))}
        </div>

        {/* 재료 카운터 뱃지 */}
        <div
          className="ml-auto flex-shrink-0 text-xs px-3 py-1 rounded-full"
          style={{
            background: isFull ? '#FFE0B2' : '#FFF3CD',
            color: isFull ? '#E65100' : '#A0703A',
            fontFamily: "'Jua', sans-serif",
            border: isFull ? '1.5px solid #FF8F00' : '1.5px solid #FFD080',
            whiteSpace: 'nowrap',
          }}
        >
          {stack.length} / {MAX}
        </div>
      </div>

      {/* 토스트 메시지 */}
      {toast && (
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 px-5 py-2.5 rounded-2xl shadow-lg text-sm font-bold pointer-events-none z-50"
          style={{
            background: '#FF6B35',
            color: '#fff',
            fontFamily: "'Jua', sans-serif",
            whiteSpace: 'nowrap',
            animation: 'fadeSlideIn 0.2s ease-out',
          }}
        >
          🚫 재료는 최대 {MAX}개까지만 추가할 수 있어요!
        </div>
      )}
    </div>
  )
}
