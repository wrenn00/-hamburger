import LeftHamsterPanel from './LeftHamsterPanel'
import BurgerScene from './BurgerScene'
import RightIngredientPanel from './RightIngredientPanel'
import { useHamsterStore } from '../store'

export default function KitchenScreen() {
  const { goToWelcome, selectedHamster, hamsters } = useHamsterStore()
  const hamster = hamsters.find((h) => h.id === selectedHamster)

  return (
    <div
      className="w-screen h-screen flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FFF5E6 0%, #FFE4B5 100%)',
        fontFamily: "'Jua', sans-serif",
      }}
    >
      {/* ── 상단 바 ── */}
      <div
        className="flex items-center justify-between px-5 py-2 shrink-0"
        style={{
          background: 'rgba(255,252,245,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${hamster?.color ?? '#FFB347'}44`,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}
      >
        <button
          onClick={goToWelcome}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold transition-all hover:scale-105 active:scale-95"
          style={{
            background: 'rgba(255,255,255,0.8)',
            color: '#A0703A',
            border: `1.5px solid ${hamster?.color ?? '#FFB347'}55`,
          }}
        >
          ← 햄스터 변경
        </button>

        <h1
          className="shimmer-text text-xl font-bold"
          style={{ fontFamily: "'Jua', sans-serif" }}
        >
          🍳 햄버거 주방
        </h1>

        <div
          className="text-sm px-3 py-1 rounded-full"
          style={{
            background: `${hamster?.color ?? '#FFB347'}22`,
            color: hamster?.color ?? '#FFB347',
          }}
        >
          {hamster?.emoji} {hamster?.title}
        </div>
      </div>

      {/* ── 3분할 패널 ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* 왼쪽 30% */}
        <div style={{ width: '30%', minWidth: 200 }} className="overflow-hidden">
          <LeftHamsterPanel />
        </div>

        {/* 중앙 50% */}
        <div style={{ width: '50%' }} className="relative overflow-hidden">
          <BurgerScene />
        </div>

        {/* 오른쪽 20% */}
        <div style={{ width: '20%', minWidth: 160 }} className="overflow-hidden">
          <RightIngredientPanel />
        </div>
      </div>
    </div>
  )
}
