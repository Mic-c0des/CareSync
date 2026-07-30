interface Props {
  current: number
  goal: number
  size?: number
  strokeWidth?: number
}

export function CircularProgress({ current, goal, size = 180, strokeWidth = 18 }: Props) {
  const safeGoal = goal > 0 ? goal : 1
  const pct = Math.min(current / safeGoal, 1)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - pct)

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e7e2d6"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1d4e45"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center px-2 text-center">
        <span className="font-display text-2xl font-semibold text-forest sm:text-3xl">
          {current.toFixed(1)}
        </span>
        <span className="text-xs text-ink/60 sm:text-sm">of {safeGoal.toFixed(0)} hrs</span>
        <span className="mt-1 text-[11px] font-medium text-clay sm:text-xs">{Math.round(pct * 100)}%</span>
      </div>
    </div>
  )
}
