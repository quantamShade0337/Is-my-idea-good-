import React, { useEffect, useState } from 'react'
import InputForm from './components/InputForm.jsx'
import ResultsView from './components/ResultsView.jsx'
import LoadingState from './components/LoadingState.jsx'
import { evaluateIdea } from './lib/scorer.js'

const STORAGE_KEY = 'startup-evaluator-last-input'

const styles = {
  page: {
    minHeight: '100vh',
    padding: '64px 24px 96px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inner: {
    width: '100%',
    maxWidth: '640px',
  },
  header: {
    marginBottom: '48px',
    textAlign: 'center',
  },
  title: {
    fontSize: '28px',
    fontWeight: '500',
    letterSpacing: '-0.03em',
    color: 'var(--text-primary)',
    lineHeight: '1.2',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '15px',
    color: 'var(--text-tertiary)',
    letterSpacing: '-0.01em',
    fontWeight: '400',
  },
  wordmark: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    fontWeight: '500',
    marginBottom: '32px',
    opacity: 0.7,
  },
  footer: {
    marginTop: '48px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
    letterSpacing: '0.02em',
  },
}

// View states
const VIEW = { INPUT: 'input', LOADING: 'loading', RESULTS: 'results' }

export default function App() {
  const [view, setView] = useState(VIEW.INPUT)
  const [result, setResult] = useState(null)
  const [savedInput, setSavedInput] = useState(null)

  // Load saved input from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setSavedInput(JSON.parse(saved))
      }
    } catch {
      // ignore
    }
  }, [])

  function handleSubmit(input) {
    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(input))
    } catch {
      // ignore
    }

    setView(VIEW.LOADING)

    // Realistic delay: 800–1100ms
    const delay = 800 + Math.floor(Math.random() * 300)

    setTimeout(() => {
      const evaluation = evaluateIdea(input.idea, input.users, input.problem)
      setResult(evaluation)
      setView(VIEW.RESULTS)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, delay)
  }

  function handleReset() {
    setResult(null)
    setView(VIEW.INPUT)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div style={styles.page}>
      <div style={styles.inner}>
        <header style={styles.header}>
          <p style={styles.wordmark}>Startup Evaluator</p>
          <h1 style={styles.title}>
            {view === VIEW.RESULTS
              ? 'Here is our evaluation'
              : 'Is this startup idea good?'}
          </h1>
          <p style={styles.subtitle}>
            {view === VIEW.RESULTS
              ? 'A structured, rule-based analysis of your idea.'
              : 'Get a structured, honest evaluation.'}
          </p>
        </header>

        {view === VIEW.INPUT && (
          <InputForm
            initialValues={savedInput}
            onSubmit={handleSubmit}
          />
        )}

        {view === VIEW.LOADING && <LoadingState />}

        {view === VIEW.RESULTS && result && (
          <ResultsView result={result} onReset={handleReset} />
        )}

        <footer style={styles.footer}>
          <p style={styles.footerText}>
            Rule-based scoring &mdash; no AI, no backend, fully static
          </p>
        </footer>
      </div>
    </div>
  )
}
