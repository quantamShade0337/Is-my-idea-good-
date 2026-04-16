import React, { useEffect, useRef, useState } from 'react'

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-primary)',
    letterSpacing: '-0.01em',
  },
  numeric: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    fontVariantNumeric: 'tabular-nums',
  },
  track: {
    height: '6px',
    borderRadius: '100px',
    background: 'var(--bar-track)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: '100px',
    transition: 'width 800ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
}

function getBarColor(score) {
  if (score >= 7) return 'var(--score-high)'
  if (score >= 5) return 'var(--score-mid)'
  return 'var(--score-low)'
}

export default function ScoreBar({ label, score, delay = 0 }) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => {
      setWidth((score / 10) * 100)
    }, delay)
    return () => clearTimeout(t)
  }, [score, delay])

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <span style={styles.label}>{label}</span>
        <span style={{ ...styles.numeric, color: getBarColor(score) }}>
          {score.toFixed(1)}
        </span>
      </div>
      <div style={styles.track}>
        <div
          style={{
            ...styles.fill,
            width: `${width}%`,
            background: getBarColor(score),
          }}
        />
      </div>
    </div>
  )
}
