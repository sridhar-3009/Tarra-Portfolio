// ─── Agent Skills ─────────────────────────────────────────────────────────────
// Skills I've published for AI coding agents (Claude Code, Cursor, and other
// agents that support the SKILL.md format). Add a new entry for each one.
//
// Entry shape:
// {
//   id:          unique string
//   title:       skill name
//   description: what the skill does, shown on the card
//   tags:        short labels shown as pills
//   agents:      agents it works with
//   marketplace: where it's listed (e.g. 'Agensi')
//   link:        listing URL
//   sourceUrl:   optional GitHub repo URL
//   date:        'YYYY-MM-DD'
// }

export const agentSkills = [
  {
    id: 'triangulate-research',
    title: 'Triangulate Research: Cited Answers That Flag Disagreement',
    description:
      'Evidence-first research: splits a question into sub-questions, ties every claim to its source URL, scores source credibility, and flags where independent sources contradict each other instead of quietly picking a side.',
    tags: ['Research', 'Citations', 'Source Credibility'],
    agents: ['Claude Code', 'Cursor', 'SKILL.md agents'],
    marketplace: 'Agensi',
    link: 'https://www.agensi.io/skills/triangulate-research-cited-answers-that-flag-disagreement',
    sourceUrl: 'https://github.com/sridhar-3009/triangulate-agent',
    date: '2026-10-29',
  },
]
