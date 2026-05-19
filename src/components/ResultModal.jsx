// 🏆 결과 모달 — 버거 이름 + 점수 + 재료 목록

import { useMemo } from 'react'
import { useBurgerStore, getBurgerName, getScore } from '../store/useBurgerStore'

function StarRow({ label, value, emoji }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span style={{ color: '#A0703A', fontFamily: "'Jua', sans-serif", fontSize: 14 }}>
        {emoji} {label}
      </span>
      <span
        className="px-3 py-0.5 rounded-full text-sm font-bold"
        style={{ background: '#FFF3CD', color: '#E65100' }}
      >
        +{value}
      </span>
    </div>
  )
}

export default function ResultModal() {
  const stack       = useBurgerStore((s) => s.stack)
  const showResult  = useBurgerStore((s) => s.showResult)
  const closeResult = useBurgerStore((s) => s.closeResult)
  const reset       = useBurgerStore((s) => s.reset)

  // useMemo로 감싸서 stack 참조가 바뀔 때만 재계산
  // → selector가 새 객체를 반환하지 않으므로 무한 루프 없음
  const burgerName = useMemo(() => getBurgerName(stack), [stack])
  const score      = useMemo(() => getScore(stack),      [stack])

  if (!showResult) return null

  const hamCount = stack.filter((i) => i.def.isHamster).length
  const headline =
    hamCount === 0
      ? '일반적이지만 맛있는 버거!'
      : hamCount === 1
      ? '한 마리 햄스터가 잠입했다! 🐹'
      : `햄스터 ${hamCount}마리 탈출 불가!! 🚨`

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0,0,0,0.50)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="relative rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        style={{
          width: 400,
          maxHeight: '85vh',
          background: 'linear-gradient(160deg, #FFFBF0 0%, #FFE8B0 100%)',
          border: '3px solid #FFD700',
          fontFamily: "'Jua', sans-serif",
        }}
      >
        {/* 헤더 */}
        <div
          className="text-center px-8 pt-7 pb-5"
          style={{ borderBottom: '1.5px solid #FFE08066' }}
        >
          <div className="text-5xl mb-3 title-bounce inline-block">🍔</div>
          <h2 className="text-2xl font-bold mb-1" style={{ color: '#3D2C00' }}>
            {burgerName}
          </h2>
          <p className="text-sm" style={{ color: '#A0703A' }}>{headline}</p>
        </div>

        {/* 점수 */}
        <div className="px-8 py-4" style={{ borderBottom: '1.5px solid #FFE08066' }}>
          <StarRow label="재료 다양성" value={score.variety} emoji="⭐" />
          {score.hamster > 0 && (
            <StarRow label="햄스터 보너스" value={score.hamster} emoji="🐹" />
          )}
          <div
            className="flex items-center justify-between mt-2 pt-2"
            style={{ borderTop: '1px dashed #FFD700' }}
          >
            <span className="font-bold" style={{ color: '#7A5C2A', fontSize: 15 }}>
              총점
            </span>
            <span
              className="text-2xl font-bold shimmer-text"
              style={{ fontFamily: "'Jua', sans-serif" }}
            >
              {score.total}점
            </span>
          </div>
        </div>

        {/* 재료 목록 */}
        <div className="px-8 py-4 overflow-y-auto flex-1">
          <p className="text-xs mb-2" style={{ color: '#A0703A' }}>들어간 재료 ({stack.length}개)</p>
          <div className="flex flex-wrap gap-2">
            {[...stack].reverse().map((item) => (
              <span
                key={item.uid}
                className="px-2 py-1 rounded-xl text-xs"
                style={{
                  background: item.def.isHamster ? '#FFF9C4' : 'rgba(255,255,255,0.8)',
                  border: `1.5px solid ${item.def.isHamster ? '#FFD700' : item.def.cardBorder}`,
                  color: '#3D2C00',
                }}
              >
                {item.def.emoji} {item.def.name}
              </span>
            ))}
          </div>
        </div>

        {/* 버튼 */}
        <div className="px-8 pb-7 pt-4 flex gap-3">
          <button
            onClick={closeResult}
            className="flex-1 py-2.5 rounded-2xl text-sm font-bold transition-all hover:scale-[1.02] active:scale-95"
            style={{ background: '#F5E6C8', color: '#A0703A', border: '1.5px solid #DFC090' }}
          >
            계속 수정하기
          </button>
          <button
            onClick={reset}
            className="flex-1 py-2.5 rounded-2xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #FFB347, #FFD700)',
              boxShadow: '0 4px 14px rgba(255,179,71,0.5)',
            }}
          >
            🔄 다시 만들기
          </button>
        </div>
      </div>
    </div>
  )
}
