import React, { useEffect, useState } from 'react'
import ScoreBar from './ScoreBar.jsx'

const styles = {
  container: {
    animation: 'fadeInUp 400ms ease both',
  },
  overallCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    padding: '40px 40px 36px',
    marginBottom: '16px',
    boxShadow: 'var(--shadow-md)',
    textAlign: 'center',
  },
  overallLabel: {
    fontSize: '12px',
    fontWeight: '500',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-tertiary)',
    marginBottom: '12px',
    display: 'block',
  },
  overallScore: {
    fontSize: '64px',
    fontWeight: '300',
    letterSpacing: '-0.04em',
    lineHeight: 1,
    marginBottom: '4px',
    fontVariantNumeric: 'tabular-nums',
    animation: 'scoreCount 500ms cubic-bezier(0.4, 0, 0.2, 1) both',
    animationDelay: '100ms',
  },
  outOf: {
    fontSize: '28px',
    fontWeight: '300',
    color: 'var(--text-tertiary)',
    letterSpacing: '-0.02em',
  },
  verdictPill: {
    display: 'inline-block',
    marginTop: '16px',
    padding: '6px 16px',
    borderRadius: '100px',
    fontSize: '13px',
    fontWeight: '500',
    background: 'var(--accent-light)',
    color: 'var(--accent)',
  },
  section: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    padding: '32px 40px',
    marginBottom: '16px',
    boxShadow: 'var(--shadow-sm)',
  },
  sectionTitle: {
    fontSize: '12px',
    fontWeight: '500',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--text-tertiary)',
    marginBottom: '24px',
    display: 'block',
  },
  barsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  insightsList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  insightItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  insightDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--text-tertiary)',
    flexShrink: 0,
    marginTop: '8px',
  },
  insightText: {
    fontSize: '14px',
    lineHeight: '1.7',
    color: 'var(--text-secondary)',
  },
  suggestionsList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  suggestionItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
    padding: '12px 16px',
    background: 'var(--accent-subtle)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--accent-light)',
  },
  suggestionNum: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--accent)',
    flexShrink: 0,
    marginTop: '2px',
    letterSpacing: '0.02em',
  },
  suggestionText: {
    fontSize: '13.5px',
    lineHeight: '1.6',
    color: 'var(--text-primary)',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  },
  btnSecondary: {
    flex: 1,
    padding: '12px 20px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    fontSize: '13.5px',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all var(--transition)',
    letterSpacing: '-0.01em',
  },
  btnPrimary: {
    flex: 1,
    padding: '12px 20px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid transparent',
    background: 'var(--text-primary)',
    fontSize: '13.5px',
    fontWeight: '500',
    color: '#fff',
    cursor: 'pointer',
    transition: 'all var(--transition)',
    letterSpacing: '-0.01em',
  },
  copySuccess: {
    color: 'var(--score-high)',
  },
}

function getScoreColor(score) {
  if (score >= 7) return 'var(--score-high)'
  if (score >= 5) return 'var(--score-mid)'
  return 'var(--score-low)'
}

export default function ResultsView({ result, onReset }) {
  const [copied, setCopied] = useState(false)
  const [hoveredBtn, setHoveredBtn] = useState(null)

  const handleCopy = () => {
    const { overall, scores, verdict, insights, suggestions } = result

    const text = [
      'STARTUP IDEA EVALUATION',
      '─'.repeat(32),
      `Overall Score: ${overall} / 10`,
      `Verdict: ${verdict}`,
      '',
      'DIMENSION SCORES',
      `Problem Clarity:     ${scores.problemClarity.toFixed(1)} / 10`,
      `Market Size:         ${scores.marketSize.toFixed(1)} / 10`,
      `Competition:         ${scores.competition.toFixed(1)} / 10`,
      `Execution:           ${scores.executionDifficulty.toFixed(1)} / 10`,
      '',
      'INSIGHTS',
      ...insights.map((i, idx) => `${idx + 1}. ${i}`),
      '',
      'SUGGESTIONS',
      ...suggestions.map((s, idx) => `${idx + 1}. ${s}`),
    ].join('\n')

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={styles.container}>
      {/* Overall score */}
      <div style={styles.overallCard}>
        <span style={styles.overallLabel}>Overall Score</span>
        <div
          style={{
            ...styles.overallScore,
            color: getScoreColor(result.overall),
          }}
        >
          {result.overall.toFixed(1)}
          <span style={styles.outOf}> / 10</span>
        </div>
        <div style={styles.verdictPill}>{result.verdict}</div>
      </div>

      {/* Breakdown */}
      <div style={styles.section}>
        <span style={styles.sectionTitle}>Breakdown</span>
        <div style={styles.barsGrid}>
          <ScoreBar label="Problem Clarity" score={result.scores.problemClarity} delay={80} />
          <ScoreBar label="Market Size" score={result.scores.marketSize} delay={180} />
          <ScoreBar label="Competition" score={result.scores.competition} delay={280} />
          <ScoreBar label="Execution Difficulty" score={result.scores.executionDifficulty} delay={380} />
        </div>
      </div>

      {/* Insights */}
      <div style={styles.section}>
        <span style={styles.sectionTitle}>Analysis</span>
        <ul style={styles.insightsList}>
          {result.insights.map((insight, i) => (
            <li key={i} style={styles.insightItem}>
              <div style={styles.insightDot} />
              <span style={styles.insightText}>{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suggestions */}
      <div style={styles.section}>
        <span style={styles.sectionTitle}>How to improve</span>
        <ul style={styles.suggestionsList}>
          {result.suggestions.map((s, i) => (
            <li key={i} style={styles.suggestionItem}>
              <span style={styles.suggestionNum}>{String(i + 1).padStart(2, '0')}</span>
              <span style={styles.suggestionText}>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button
          style={{
            ...styles.btnSecondary,
            ...(hoveredBtn === 'reset' ? { background: 'var(--bg)', color: 'var(--text-primary)' } : {}),
          }}
          onClick={onReset}
          onMouseEnter={() => setHoveredBtn('reset')}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          Evaluate another idea
        </button>
        <button
          style={{
            ...styles.btnPrimary,
            ...(hoveredBtn === 'copy' ? { opacity: 0.85 } : {}),
            ...(copied ? styles.copySuccess : {}),
          }}
          onClick={handleCopy}
          onMouseEnter={() => setHoveredBtn('copy')}
          onMouseLeave={() => setHoveredBtn(null)}
        >
          {copied ? 'Copied to clipboard' : 'Copy results'}
        </button>
      </div>
    </div>
  )
}
