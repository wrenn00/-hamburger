import HamsterCard from './HamsterCard'
import { useHamsterStore } from '../store'

export default function WelcomeScreen() {
  const { hamsters, goToKitchen } = useHamsterStore()

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-10"
      style={{
        background: 'linear-gradient(160deg, #FFF5E6 0%, #FFE4B5 55%, #FFDCA0 100%)',
        fontFamily: "'Jua', sans-serif",
      }}
    >
      {/* 배경 장식 원 */}
      <div
        className="fixed pointer-events-none"
        style={{
          top: '-120px', left: '-120px',
          width: 400, height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #FFD70033 0%, transparent 70%)',
        }}
      />
      <div
        className="fixed pointer-events-none"
        style={{
          bottom: '-100px', right: '-100px',
          width: 350, height: 350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #FFB34733 0%, transparent 70%)',
        }}
      />

      {/* 타이틀 영역 */}
      <div className="text-center mb-10 fade-slide-in" style={{ animationDelay: '0s' }}>
        <div className="text-5xl mb-3 title-bounce inline-block">🍔</div>
        <h1
          className="shimmer-text text-5xl font-bold mb-3 leading-tight"
          style={{ fontFamily: "'Jua', sans-serif", letterSpacing: '-0.5px' }}
        >
          햄버거에 오신 걸 환영합니다 🍔
        </h1>
        <p
          className="text-lg"
          style={{ color: '#A0703A', fontFamily: "'Quicksand', 'Jua', sans-serif", fontWeight: 600 }}
        >
          당신의 요리 파트너를 선택해주세요 🐹✨
        </p>
      </div>

      {/* 햄스터 카드 리스트 */}
      <div className="flex flex-wrap justify-center gap-6">
        {hamsters.map((hamster, i) => (
          <HamsterCard
            key={hamster.id}
            hamster={hamster}
            index={i}
            onClick={goToKitchen}
          />
        ))}
      </div>

      {/* 하단 힌트 */}
      <p
        className="mt-10 text-sm fade-slide-in"
        style={{ color: '#C49A55', animationDelay: '0.5s', fontFamily: "'Quicksand', sans-serif" }}
      >
        카드를 클릭해서 햄스터를 선택하세요 🍟
      </p>
    </div>
  )
}
