import React, { useEffect, useState } from 'react'

const steps = [
  'Analysing problem clarity…',
  'Estimating market size…',
  'Scanning competitive signals…',
  'Calculating execution difficulty…',
]

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 24px',
    gap: '24px',
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '2px solid var(--border)',
    borderTopColor: 'var(--text-secondary)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  stepText: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    height: '20px',
    transition: 'opacity 300ms ease',
    textAlign: 'center',
  },
}

// Inject keyframes once
if (typeof document !== 'undefined' && !document.getElementById('spin-style')) {
  const style = document.createElement('style')
  style.id = 'spin-style'
  style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`
  document.head.appendChild(style)
}

export default function LoadingState() {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex(i => (i + 1) % steps.length)
    }, 280)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={styles.container}>
      <div style={styles.spinner} />
      <p style={styles.stepText}>{steps[stepIndex]}</p>
    </div>
  )
}
