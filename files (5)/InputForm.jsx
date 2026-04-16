import React, { useEffect, useRef, useState } from 'react'
import { EXAMPLE_IDEAS } from '../lib/scorer.js'

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    animation: 'fadeInUp 400ms ease both',
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    padding: '32px 40px 36px',
    boxShadow: 'var(--shadow-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '500',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'var(--text-tertiary)',
  },
  textarea: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    background: 'var(--bg)',
    fontSize: '15px',
    lineHeight: '1.6',
    color: 'var(--text-primary)',
    resize: 'none',
    outline: 'none',
    transition: 'border-color var(--transition), box-shadow var(--transition)',
    overflow: 'hidden',
    minHeight: '120px',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    background: 'var(--bg)',
    fontSize: '14px',
    lineHeight: '1.5',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color var(--transition), box-shadow var(--transition)',
  },
  optionalRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  divider: {
    height: '1px',
    background: 'var(--border-light)',
    margin: '4px 0',
  },
  submitBtn: {
    width: '100%',
    padding: '15px 24px',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    background: 'var(--text-primary)',
    color: '#fff',
    fontSize: '14.5px',
    fontWeight: '500',
    letterSpacing: '-0.01em',
    cursor: 'pointer',
    transition: 'all var(--transition)',
  },
  exampleBar: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  exampleLabel: {
    fontSize: '12px',
    color: 'var(--text-tertiary)',
    fontWeight: '500',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    flexShrink: 0,
  },
  exampleChip: {
    padding: '5px 12px',
    borderRadius: '100px',
    border: '1px solid var(--border)',
    background: 'var(--surface)',
    fontSize: '12.5px',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    transition: 'all var(--transition)',
    letterSpacing: '-0.01em',
  },
  charCount: {
    fontSize: '11px',
    color: 'var(--text-tertiary)',
    textAlign: 'right',
    marginTop: '-4px',
  },
  errorText: {
    fontSize: '12.5px',
    color: 'var(--score-low)',
    marginTop: '-8px',
  },
}

const FOCUSED_STYLE = {
  borderColor: 'var(--text-tertiary)',
  boxShadow: '0 0 0 3px rgba(0,0,0,0.04)',
}

const exampleLabels = ['Niche SaaS', 'Vague AI idea', 'E-commerce tool', 'Freelancer community']

export default function InputForm({ initialValues, onSubmit }) {
  const [idea, setIdea] = useState(initialValues?.idea || '')
  const [users, setUsers] = useState(initialValues?.users || '')
  const [problem, setProblem] = useState(initialValues?.problem || '')
  const [focused, setFocused] = useState(null)
  const [hoveredChip, setHoveredChip] = useState(null)
  const [hoveredBtn, setHoveredBtn] = useState(false)
  const [error, setError] = useState('')

  const textareaRef = useRef(null)

  useEffect(() => {
    autoResize(textareaRef.current)
  }, [idea])

  function autoResize(el) {
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }

  function handleIdeaChange(e) {
    setIdea(e.target.value)
    setError('')
    autoResize(e.target)
  }

  function handleSubmit() {
    if (idea.trim().length < 20) {
      setError('Please describe your idea in at least a few sentences.')
      return
    }
    onSubmit({ idea: idea.trim(), users: users.trim(), problem: problem.trim() })
  }

  function loadExample(index) {
    const ex = EXAMPLE_IDEAS[index]
    setIdea(ex.idea)
    setUsers(ex.users)
    setProblem(ex.problem)
    setError('')
    setTimeout(() => autoResize(textareaRef.current), 0)
  }

  const isReady = idea.trim().length >= 20

  return (
    <div style={styles.form}>
      <div style={styles.card}>
        <div style={styles.fieldGroup}>
          <label style={styles.label}>Your Startup Idea</label>
          <textarea
            ref={textareaRef}
            style={{
              ...styles.textarea,
              ...(focused === 'idea' ? FOCUSED_STYLE : {}),
            }}
            placeholder="Describe your startup idea in a few sentences. What does it do, who is it for, and how does it work?"
            value={idea}
            onChange={handleIdeaChange}
            onFocus={() => setFocused('idea')}
            onBlur={() => setFocused(null)}
            rows={4}
          />
          <div style={styles.charCount}>{idea.length} characters</div>
          {error && <p style={styles.errorText}>{error}</p>}
        </div>

        <div style={styles.divider} />

        <div style={styles.optionalRow}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Target Users <span style={{ opacity: 0.5 }}>(optional)</span></label>
            <input
              style={{
                ...styles.input,
                ...(focused === 'users' ? FOCUSED_STYLE : {}),
              }}
              placeholder="e.g. Independent dentists"
              value={users}
              onChange={e => setUsers(e.target.value)}
              onFocus={() => setFocused('users')}
              onBlur={() => setFocused(null)}
            />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Problem it solves <span style={{ opacity: 0.5 }}>(optional)</span></label>
            <input
              style={{
                ...styles.input,
                ...(focused === 'problem' ? FOCUSED_STYLE : {}),
              }}
              placeholder="e.g. Manual recall tracking"
              value={problem}
              onChange={e => setProblem(e.target.value)}
              onFocus={() => setFocused('problem')}
              onBlur={() => setFocused(null)}
            />
          </div>
        </div>

        <button
          style={{
            ...styles.submitBtn,
            ...(hoveredBtn && isReady ? { opacity: 0.85, transform: 'translateY(-1px)' } : {}),
            ...(hoveredBtn && !isReady ? {} : {}),
            ...(!isReady ? { opacity: 0.45, cursor: 'not-allowed' } : {}),
          }}
          onClick={handleSubmit}
          onMouseEnter={() => setHoveredBtn(true)}
          onMouseLeave={() => setHoveredBtn(false)}
        >
          Evaluate Idea
        </button>
      </div>

      <div style={styles.exampleBar}>
        <span style={styles.exampleLabel}>Try an example</span>
        {exampleLabels.map((label, i) => (
          <button
            key={i}
            style={{
              ...styles.exampleChip,
              ...(hoveredChip === i ? { background: 'var(--bg)', color: 'var(--text-primary)' } : {}),
            }}
            onClick={() => loadExample(i)}
            onMouseEnter={() => setHoveredChip(i)}
            onMouseLeave={() => setHoveredChip(null)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
