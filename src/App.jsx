import IngredientTray from './components/IngredientTray'
import BurgerScene from './components/BurgerScene'
import ResultModal from './components/ResultModal'
import { useBurgerStore } from './store/useBurgerStore'

// ── 배경 장식 이모지 ────────────────────────────────────────
const DECO = [
  { e: '🍅', x: 5,  y: 60, r: -15, s: 1.4 },
  { e: '🥬', x: 12, y: 75, r: 20,  s: 1.2 },
  { e: '🧅', x: 88, y: 65, r: -8,  s: 1.3 },
  { e: '🥒', x: 92, y: 78, r: 25,  s: 1.1 },
  { e: '🧀', x: 3,  y: 82, r: 10,  s: 1.2 },
  { e: '🥓', x: 82, y: 88, r: -20, s: 1.0 },
  { e: '🍳', x: 20, y: 90, r: 5,   s: 1.1 },
  { e: '🥩', x: 75, y: 72, r: -12, s: 1.3 },
]

// ── 하단 액션 바 ─────────────────────────────────────────────
function ActionBar() {
  const { stack, reset, startCompletion, isCompleting } = useBurgerStore()
  const count = stack.length
  const canComplete = count >= 2 && !isCompleting

  return (
    <div
      className="w-full h-full flex items-center justify-center gap-5 px-8"
      style={{
        background: 'rgba(255,252,245,0.94)',
        backdropFilter: 'blur(12px)',
        borderTop: '2px solid rgba(200,160,80,0.18)',
      }}
    >
      {/* 리셋 */}
      <button
        onClick={reset}
        disabled={count === 0}
        className="px-5 py-2.5 rounded-2xl text-sm font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
        style={{
          background: '#F0ECE4',
          color: '#7A5C2A',
          border: '1.5px solid #D4C4A0',
          fontFamily: "'Jua', sans-serif",
        }}
      >
        🗑️ 처음부터
      </button>

      {/* 재료 카운터 */}
      <div
        className="text-sm px-4 py-2 rounded-2xl"
        style={{
          background: count > 0 ? '#FFF3CD' : 'transparent',
          color: '#A0703A',
          fontFamily: "'Jua', sans-serif",
          minWidth: 90,
          textAlign: 'center',
          transition: 'background 0.3s',
        }}
      >
        {count > 0 ? `재료 ${count}개 🍔` : '재료를 골라봐요!'}
      </div>

      {/* 완성 */}
      <button
        onClick={startCompletion}
        disabled={!canComplete}
        className="px-7 py-2.5 rounded-2xl text-base font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          background: canComplete
            ? 'linear-gradient(135deg, #FFB347 0%, #FFD700 100%)'
            : '#CCC',
          boxShadow: canComplete ? '0 4px 18px rgba(255,179,71,0.55)' : 'none',
          fontFamily: "'Jua', sans-serif",
        }}
      >
        완성! 🍔
      </button>
    </div>
  )
}

// ── 메인 레이아웃 ────────────────────────────────────────────
export default function App() {
  return (
    <div
      className="w-screen h-screen overflow-hidden flex flex-col relative"
      style={{ fontFamily: "'Jua', sans-serif" }}
    >
      {/* ── CSS 주방 배경 ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          // 크림색 그리드 타일 벽
          background: `
            linear-gradient(rgba(190,155,100,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(190,155,100,0.12) 1px, transparent 1px),
            linear-gradient(160deg, #FFF8EE 0%, #FFF0D8 60%, #FFE8C0 100%)
          `,
          backgroundSize: '52px 52px, 52px 52px, 100% 100%',
        }}
      />

      {/* ── 바닥 장식 이모지 ── */}
      {DECO.map((d, i) => (
        <div
          key={i}
          className="absolute pointer-events-none select-none"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            fontSize: `${d.s * 2}rem`,
            transform: `rotate(${d.r}deg)`,
            opacity: 0.12,
            filter: 'blur(1.5px)',
          }}
        >
          {d.e}
        </div>
      ))}

      {/* ── 상단 트레이 (25%) ── */}
      <div className="relative z-10 flex-shrink-0" style={{ height: '25%' }}>
        <IngredientTray />
      </div>

      {/* ── 중앙 3D 씬 (65%) ── */}
      <div
        className="relative z-10 flex-1"
        style={{
          /* 중앙 빛나는 영역 */
          background: 'radial-gradient(ellipse 70% 60% at 50% 60%, rgba(255,220,150,0.18) 0%, transparent 70%)',
        }}
      >
        <BurgerScene />

        {/* 클릭 힌트 */}
        <div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full pointer-events-none"
          style={{
            background: 'rgba(255,255,255,0.65)',
            color: '#A0703A',
            backdropFilter: 'blur(6px)',
          }}
        >
          드래그로 회전 · 스크롤로 줌 · 재료 클릭으로 제거
        </div>
      </div>

      {/* ── 하단 액션 바 (10%) ── */}
      <div className="relative z-10 flex-shrink-0" style={{ height: '10%', minHeight: 60 }}>
        <ActionBar />
      </div>

      {/* ── 결과 모달 ── */}
      <ResultModal />
    </div>
  )
}
