// ─── Keyword dictionaries ───────────────────────────────────────────────────

const VAGUE_WORDS = [
  'platform', 'ecosystem', 'solution', 'leverage', 'synergy', 'disrupt',
  'revolutionary', 'game-changing', 'everything', 'seamless', 'world-class',
  'next-gen', 'innovative', 'transform', 'empower', 'reimagine', 'uber for',
  'airbnb for', 'tinder for', 'spotify for', 'netflix for'
]

const CROWDED_WORDS = [
  'ai', 'artificial intelligence', 'machine learning', 'ml', 'chatgpt',
  'crypto', 'blockchain', 'nft', 'web3', 'defi', 'metaverse', 'vr',
  'social media', 'social network', 'marketplace', 'gig economy', 'influencer'
]

const NICHE_SIGNALS = [
  'dentist', 'plumber', 'electrician', 'contractor', 'attorney', 'lawyer',
  'accountant', 'nurse', 'teacher', 'vet', 'veterinarian', 'pharmacist',
  'restaurant owner', 'salon owner', 'gym owner', 'mechanic', 'farmer',
  'freelancer', 'consultant', 'therapist', 'coach', 'realtor', 'architect',
  'engineer', 'designer', 'developer', 'researcher', 'scientist', 'pilot',
  'truck driver', 'logistics', 'supply chain', 'manufacturing', 'construction',
  'e-commerce', 'saas', 'b2b', 'enterprise', 'healthcare', 'fintech', 'edtech',
  'proptech', 'legaltech', 'hr tech', 'retail', 'hospitality'
]

const BROAD_AUDIENCE = [
  'everyone', 'anyone', 'all people', 'all users', 'general public',
  'consumers', 'businesses', 'all companies', 'whole world', 'global',
  'millions', 'billions', 'any person', 'all industries'
]

const SPECIFIC_PROBLEM_SIGNALS = [
  'spend too much time', 'manually', 'frustrating', 'painful', 'broken',
  'waste hours', 'difficult to', 'no easy way', 'hard to find', 'expensive',
  'costs too much', 'nobody solves', 'existing tools', 'current options',
  'spreadsheet', 'email back and forth', 'phone tag', 'lack of', 'missing'
]

const COMPLEX_EXECUTION = [
  'hardware', 'physical product', 'supply chain', 'logistics', 'government',
  'regulation', 'fda', 'hipaa', 'legal requirement', 'patent', 'factory',
  'manufacture', 'shipping', 'delivery network', 'infrastructure',
  'marketplace with both sides', 'two-sided', 'cold start', 'network effect required',
  'massive dataset', 'data labeling', 'satellite', 'robotics', 'drone', 'biotech'
]

const SIMPLE_EXECUTION = [
  'saas', 'software', 'web app', 'mobile app', 'api', 'plugin', 'extension',
  'browser extension', 'dashboard', 'analytics', 'newsletter', 'community',
  'directory', 'database', 'tool', 'integration', 'automation', 'no-code',
  'template', 'chrome extension', 'zapier'
]

const MONETIZATION_SIGNALS = [
  'subscription', 'saas', 'freemium', 'per seat', 'usage-based', 'transaction fee',
  'commission', 'licensing', 'white label', 'enterprise contract', 'monthly fee',
  'annual plan', 'paid tier', 'premium'
]

const EXAMPLE_IDEAS = [
  {
    idea: 'A SaaS tool that helps independent dentists manage patient recalls, appointment reminders, and follow-ups — replacing manual phone calls and spreadsheets.',
    users: 'Independent dentists and small dental practices',
    problem: 'Dental practices lose revenue from missed recall appointments because they rely on manual phone calls and spreadsheets to track follow-ups.'
  },
  {
    idea: 'An AI-powered platform for everyone to disrupt the social media ecosystem with revolutionary content creation tools.',
    users: 'Everyone',
    problem: 'People want better content'
  },
  {
    idea: 'A B2B SaaS that automates invoice reconciliation for small e-commerce businesses — connecting Shopify, Stripe, and their accounting software automatically.',
    users: 'Small e-commerce founders and operators doing $100k–$2M in annual revenue',
    problem: 'E-commerce owners spend 4–6 hours per week manually matching invoices and payments across platforms, leading to accounting errors and delayed decisions.'
  },
  {
    idea: 'A subscription community and resource library for freelance UX designers — templates, contracts, client scripts, and peer support.',
    users: 'Freelance UX/product designers in the first 3 years of freelancing',
    problem: 'Freelance designers struggle to find professional contracts, know what to charge, and handle difficult client situations — and there is no trusted community focused specifically on this.'
  }
]

// ─── Scoring helpers ─────────────────────────────────────────────────────────

function countMatches(text, wordList) {
  const lower = text.toLowerCase()
  return wordList.filter(w => lower.includes(w.toLowerCase())).length
}

function normalize(value, min, max) {
  return Math.min(10, Math.max(0, ((value - min) / (max - min)) * 10))
}

function clamp(val, min = 0, max = 10) {
  return Math.min(max, Math.max(min, val))
}

// ─── Dimension scorers ───────────────────────────────────────────────────────

function scoreProblemClarity(idea, problem) {
  const combined = `${idea} ${problem}`.toLowerCase()
  let score = 5.0

  // Specific problem signals boost clarity
  const specificHits = countMatches(combined, SPECIFIC_PROBLEM_SIGNALS)
  score += Math.min(specificHits * 0.8, 3.0)

  // Vague words hurt clarity
  const vagueHits = countMatches(combined, VAGUE_WORDS)
  score -= Math.min(vagueHits * 0.7, 3.0)

  // Longer, detailed problem description is a good sign
  const wordCount = combined.split(/\s+/).filter(Boolean).length
  if (wordCount > 80) score += 0.8
  else if (wordCount > 40) score += 0.4
  else if (wordCount < 15) score -= 1.5

  // Problem field filled in at all
  if (problem.trim().length > 20) score += 0.5

  return clamp(score)
}

function scoreMarketSize(idea, users) {
  const combined = `${idea} ${users}`.toLowerCase()
  let score = 5.0

  // Niche is actually good — it means you can reach them
  const nicheHits = countMatches(combined, NICHE_SIGNALS)
  if (nicheHits >= 2) score += 1.5
  else if (nicheHits === 1) score += 0.8

  // Broad audience claims inflate market score slightly but hurt elsewhere
  const broadHits = countMatches(combined, BROAD_AUDIENCE)
  if (broadHits > 0) score += 0.5 // sounds big but penalized in clarity

  // Known large verticals
  const largeVerticals = ['healthcare', 'finance', 'education', 'real estate', 'hr', 'legal', 'insurance', 'logistics']
  const verticalHits = countMatches(combined, largeVerticals)
  score += Math.min(verticalHits * 0.6, 1.5)

  // B2B / enterprise often larger TAM
  if (combined.includes('b2b') || combined.includes('enterprise') || combined.includes('business')) score += 0.5

  return clamp(score)
}

function scoreCompetition(idea, users, problem) {
  const combined = `${idea} ${users} ${problem}`.toLowerCase()
  let score = 7.0 // start optimistic — competition validates market

  // Crowded spaces significantly lower this dimension
  const crowdedHits = countMatches(combined, CROWDED_WORDS)
  score -= Math.min(crowdedHits * 1.2, 4.0)

  // Very broad marketplace/platform ideas are saturated
  if ((combined.includes('marketplace') || combined.includes('platform')) && countMatches(combined, VAGUE_WORDS) > 1) {
    score -= 1.5
  }

  // Niche specificity reduces direct competition
  const nicheHits = countMatches(combined, NICHE_SIGNALS)
  score += Math.min(nicheHits * 0.5, 2.0)

  // Specific workflow tools have differentiation room
  if (combined.includes('automat') || combined.includes('integrat') || combined.includes('workflow')) {
    score += 0.5
  }

  return clamp(score)
}

function scoreExecutionDifficulty(idea, users, problem) {
  // Higher = easier to execute (better score)
  const combined = `${idea} ${users} ${problem}`.toLowerCase()
  let score = 6.0

  // Complex domains lower executability
  const complexHits = countMatches(combined, COMPLEX_EXECUTION)
  score -= Math.min(complexHits * 1.1, 4.0)

  // Simple software ideas are easier
  const simpleHits = countMatches(combined, SIMPLE_EXECUTION)
  score += Math.min(simpleHits * 0.6, 2.5)

  // Clear monetization = easier path to revenue
  const monoHits = countMatches(combined, MONETIZATION_SIGNALS)
  score += Math.min(monoHits * 0.5, 1.5)

  // Two-sided marketplace = hard
  if (combined.includes('marketplace') || (combined.includes('connect') && combined.includes('buyer'))) {
    score -= 1.5
  }

  // B2B software = manageable
  if (combined.includes('b2b') || combined.includes('saas')) score += 0.5

  return clamp(score)
}

// ─── Verdict & insights ───────────────────────────────────────────────────────

function getVerdict(overall, scores) {
  if (overall >= 7.5) return 'Strong idea with clear potential'
  if (overall >= 6.5) {
    if (scores.competition < 5) return 'Solid idea in a crowded space'
    return 'Solid idea, needs sharper positioning'
  }
  if (overall >= 5.5) {
    if (scores.problemClarity < 5) return 'Interesting direction, problem needs sharpening'
    return 'Viable concept with real execution risks'
  }
  if (overall >= 4.5) return 'Rough idea — needs significant refinement'
  return 'Too vague or crowded to evaluate confidently'
}

function getInsights(idea, users, problem, scores) {
  const combined = `${idea} ${users} ${problem}`.toLowerCase()
  const insights = []

  // Problem clarity insights
  if (scores.problemClarity >= 7) {
    insights.push('The problem is well-defined and grounded in a specific, recognizable pain.')
  } else if (scores.problemClarity >= 5) {
    insights.push('The problem has some shape, but lacks the specificity needed to validate demand.')
  } else {
    insights.push('The problem statement is unclear. Without a specific pain point, it\'s hard to build something people will pay for.')
  }

  // Market insights
  const nicheHits = countMatches(combined, NICHE_SIGNALS)
  if (nicheHits >= 1 && scores.marketSize >= 6) {
    insights.push('You\'ve identified a defined target audience. Niche focus is a strength — it makes acquisition, messaging, and product decisions easier.')
  } else if (countMatches(combined, BROAD_AUDIENCE) > 0) {
    insights.push('A broad target audience is a signal that the idea isn\'t focused yet. "Everyone" as a customer means no clear go-to-market path.')
  } else {
    insights.push('The target market is somewhat defined, but could be narrowed further to make early traction more achievable.')
  }

  // Competition insights
  const crowdedHits = countMatches(combined, CROWDED_WORDS)
  if (crowdedHits >= 2) {
    insights.push(`The space includes overused signals (${CROWDED_WORDS.filter(w => combined.includes(w)).slice(0, 2).join(', ')}). These categories attract heavy competition and investor fatigue — differentiation needs to be extremely sharp.`)
  } else if (scores.competition >= 7) {
    insights.push('The competitive landscape appears relatively open, or the niche focus creates natural defensibility.')
  } else {
    insights.push('There are likely established players in this category. The opportunity depends on finding a specific wedge where incumbents underserve a segment.')
  }

  // Execution insights
  const complexHits = countMatches(combined, COMPLEX_EXECUTION)
  const simpleHits = countMatches(combined, SIMPLE_EXECUTION)
  if (complexHits >= 2) {
    insights.push('Execution complexity is high — this idea likely requires significant capital, technical depth, or regulatory navigation before reaching customers.')
  } else if (simpleHits >= 1 && scores.executionDifficulty >= 7) {
    insights.push('This is a software-first idea with a relatively clear build path. A lean MVP is achievable, which lowers early risk considerably.')
  } else {
    insights.push('Execution difficulty is moderate. The path from idea to paying customer is possible, but the scope needs to be tightened to move fast.')
  }

  return insights
}

function getSuggestions(idea, users, problem, scores) {
  const combined = `${idea} ${users} ${problem}`.toLowerCase()
  const suggestions = []

  if (scores.problemClarity < 6) {
    suggestions.push('Define the problem more specifically. What is the exact moment a user feels this pain? Describe one real scenario.')
  }

  if (countMatches(combined, BROAD_AUDIENCE) > 0 || users.trim().length < 10) {
    suggestions.push('Narrow your target user to a single, specific role or situation. The more specific, the clearer your product and marketing decisions become.')
  }

  if (countMatches(combined, VAGUE_WORDS) >= 2) {
    suggestions.push('Remove vague language ("platform", "ecosystem", "revolutionary"). Replace each with a concrete description of what the product actually does.')
  }

  if (countMatches(combined, CROWDED_WORDS) >= 1) {
    suggestions.push('If AI, blockchain, or other crowded terms are core to the product, articulate clearly why the timing or approach is differentiated — not just what the tech is.')
  }

  if (scores.executionDifficulty < 5) {
    suggestions.push('Consider a narrower first version. Identify the single workflow that delivers the most value and ship that before building anything else.')
  }

  if (countMatches(combined, MONETIZATION_SIGNALS) === 0) {
    suggestions.push('Think through pricing early. Who pays, how much, and why now? A clear monetization model signals commercial viability.')
  }

  if (suggestions.length === 0) {
    suggestions.push('Validate the problem with five potential customers before writing any code. Their language will sharpen your positioning significantly.')
    suggestions.push('Document your assumed customer acquisition channel. How does the first paying customer find you?')
  }

  return suggestions.slice(0, 4)
}

// ─── Main evaluate function ───────────────────────────────────────────────────

export function evaluateIdea(idea, users = '', problem = '') {
  const scores = {
    problemClarity: scoreProblemClarity(idea, problem),
    marketSize: scoreMarketSize(idea, users),
    competition: scoreCompetition(idea, users, problem),
    executionDifficulty: scoreExecutionDifficulty(idea, users, problem)
  }

  // Weighted average: problem clarity matters most
  const weights = {
    problemClarity: 0.32,
    marketSize: 0.25,
    competition: 0.22,
    executionDifficulty: 0.21
  }

  const overall = Object.entries(scores).reduce((sum, [key, val]) => {
    return sum + val * weights[key]
  }, 0)

  const roundedOverall = Math.round(overall * 10) / 10

  return {
    overall: roundedOverall,
    scores,
    verdict: getVerdict(roundedOverall, scores),
    insights: getInsights(idea, users, problem, scores),
    suggestions: getSuggestions(idea, users, problem, scores)
  }
}

export { EXAMPLE_IDEAS }
