import { useHamsterStore } from '../store'
import { CATEGORIES } from '../data/ingredients'

function CompletionModal({ hamster, onClose }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)' }}
    >
      <div
        className="float-up text-center px-10 py-8 rounded-3xl shadow-2xl"
        style={{
          background: `linear-gradient(160deg, ${hamster.bgFrom}, ${hamster.bgTo})`,
          border: `3px solid ${hamster.color}`,
          fontFamily: "'Jua', sans-serif",
          maxWidth: 360,
        }}
      >
        <div className="text-6xl mb-3 title-bounce inline-block">🍔</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#3D2C00' }}>
          버거 완성!
        </h2>
        <p className="text-base mb-6" style={{ color: '#7A5C2A' }}>
          {hamster.name}의 특제 버거가<br />완성되었어요 ✨
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
            style={{ background: hamster.color }}
          >
            다시 만들기 🔄
          </button>
        </div>
      </div>
    </div>
  )
}

export default function RightIngredientPanel() {
  const {
    ingredients,
    burgerStack,
    activeCategory,
    completed,
    selectedHamster,
    hamsters,
    setActiveCategory,
    addIngredient,
    removeLastIngredient,
    clearBurger,
    completeBurger,
  } = useHamsterStore()

  const hamster = hamsters.find((h) => h.id === selectedHamster)
  const filtered = ingredients.filter((i) => i.category === activeCategory)

  return (
    <>
      {completed && hamster && (
        <CompletionModal hamster={hamster} onClose={clearBurger} />
      )}

      <div
        className="h-full flex flex-col overflow-hidden"
        style={{
          background: 'rgba(255,252,245,0.95)',
          borderLeft: `1px solid ${hamster?.color ?? '#FFB347'}44`,
          fontFamily: "'Jua', sans-serif",
        }}
      >
        {/* ── 카테고리 탭 ── */}
        <div className="flex flex-col gap-1 p-3 border-b border-amber-100">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-95"
              style={
                activeCategory === cat.id
                  ? { background: hamster?.color ?? '#FFB347', color: '#fff', boxShadow: `0 3px 10px ${hamster?.color ?? '#FFB347'}66` }
                  : { background: 'rgba(255,245,230,0.8)', color: '#A0703A' }
              }
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* ── 재료 버튼 그리드 ── */}
        <div className="p-3 grid grid-cols-2 gap-2 border-b border-amber-100">
          {filtered.map((ing) => (
            <button
              key={ing.id}
              onClick={() => addIngredient(ing.id)}
              className="flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
              style={{
                background: `${ing.color}22`,
                border: `2px solid ${ing.color}55`,
                color: '#3D2C00',
              }}
            >
              <span className="text-xl">{ing.emoji}</span>
              <span className="text-center leading-tight">{ing.name}</span>
            </button>
          ))}
        </div>

        {/* ── 현재 스택 리스트 ── */}
        <div className="flex-1 overflow-y-auto p-3 min-h-0">
          <div className="text-xs font-bold mb-2" style={{ color: '#A0703A' }}>
            현재 재료 (위→아래)
          </div>

          {burgerStack.length === 0 ? (
            <div className="text-center py-4 text-xs" style={{ color: '#C4A060' }}>
              아직 재료가 없어요 🍽️
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {[...burgerStack].reverse().map((ing, i) => (
                <div
                  key={ing.uid}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs"
                  style={{
                    background: `${ing.color}18`,
                    border: `1px solid ${ing.color}44`,
                  }}
                >
                  <span>{ing.emoji}</span>
                  <span className="flex-1 font-bold" style={{ color: '#3D2C00' }}>{ing.name}</span>
                  {i === 0 && (
                    <span className="text-xs px-1 rounded" style={{ background: ing.color, color: '#fff' }}>
                      TOP
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 하단 버튼 ── */}
        <div className="p-3 flex flex-col gap-2 border-t border-amber-100">
          <button
            onClick={removeLastIngredient}
            disabled={burgerStack.length === 0}
            className="w-full py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30"
            style={{ background: '#FFF0E0', color: '#A0703A', border: '1.5px solid #FFD080' }}
          >
            ↩ 마지막 재료 제거
          </button>
          <button
            onClick={completeBurger}
            disabled={burgerStack.length === 0}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-30 shadow-md"
            style={{
              background: burgerStack.length > 0
                ? `linear-gradient(135deg, ${hamster?.color ?? '#FFB347'}, ${hamster?.bgTo ?? '#FFD580'})`
                : '#CCC',
              boxShadow: burgerStack.length > 0 ? `0 4px 14px ${hamster?.color ?? '#FFB347'}66` : 'none',
            }}
          >
            🍔 완성!
          </button>
        </div>
      </div>
    </>
  )
}
