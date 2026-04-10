// Circular score ring used on dashboard
export default function ScoreRing({ score = 0, size = 120, strokeWidth = 10, color = '#6366f1', label = 'Score' }) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  const ringColor =
    score >= 80 ? '#10b981' :
    score >= 60 ? '#6366f1' :
    score >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative inline-flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color || ringColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-800">{score}</span>
        <span className="text-xs text-slate-400 font-medium">{label}</span>
      </div>
    </div>
  );
}
