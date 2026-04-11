export default function ScoreRing({ score = 0, size = 120, strokeWidth = 10, color, label = 'Score' }) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  const ringColor =
    score >= 80 ? 'var(--success)' :
    score >= 60 ? 'var(--primary)' :
    score >= 40 ? 'var(--warning)' : 'var(--error)';

  return (
    <div className="score-ring-container">
      <svg width={size} height={size} className="score-ring-svg">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="ring-track"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="ring-progress"
          stroke={color || ringColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="score-ring-content">
        <span className="score-value">{score}</span>
        <span className="score-label">{label}</span>
      </div>

      <style>{`
        .score-ring-container { position: relative; display: inline-flex; flex-direction: column; align-items: center; }
        .score-ring-svg { transform: rotate(-90deg); }
        .ring-track { fill: none; stroke: var(--slate-100); }
        .ring-progress { fill: none; stroke-linecap: round; transition: stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1); }
        .score-ring-content { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .score-value { font-size: 1.5rem; font-weight: 800; color: var(--slate-800); }
        .score-label { font-size: 0.75rem; color: var(--slate-400); font-weight: 600; }
      `}</style>
    </div>
  );
}
