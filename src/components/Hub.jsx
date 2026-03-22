import React, { useState } from 'react'

// ══════════════════════════════════════════════════════════════
// PASTE YOUR CLAUDE ARTIFACT LINKS HERE
// ══════════════════════════════════════════════════════════════
const LINKS = {
  jp_launchpad:      'https://claude.ai/public/artifacts/08ae9b1c-e431-4f32-9d3a-fac9f92466b8',
  ashley_launchpad:  'https://claude.ai/public/artifacts/9b3b3b0d-0563-496b-820d-c2b116ad2381',
  jp_checkin:        'https://claude.ai/public/artifacts/e7b48226-cf95-4ed6-baa4-d6d15aa519fe',
  ashley_checkin:    'https://claude.ai/public/artifacts/818034ed-4d0d-41c3-9b02-7e902600c71f',
  sunday_closing:    'https://claude.ai/public/artifacts/a95b5a71-69a4-4ff6-932f-7c3c35e93d70',
}
// ══════════════════════════════════════════════════════════════

const TOOLS = [
  {
    id: 'jp_launchpad',
    tag: 'Daily · Morning',
    person: 'JP',
    title: 'Morning Launchpad',
    desc: '7 soul-search prompts. Voice drop. AI parses into command categories — emotional release, spiritual, identity, relationship.',
    meta: ['Daily', 'Voice or type', 'AI parsed'],
    color: 'blue',
  },
  {
    id: 'jp_checkin',
    tag: 'Weekly · Saturday',
    person: 'JP',
    title: 'Weekly Check-In',
    desc: '7 accountability prompts. Win, fell short, God spoke, patterns, husband score, temperature, need. Coaching observation generated.',
    meta: ['Saturday', 'Individual', 'Logs to record'],
    color: 'blue',
  },
  {
    id: 'ashley_launchpad',
    tag: 'Daily · Morning',
    person: 'Ashley',
    title: 'Morning Reflection',
    desc: '7 reflective prompts. Heart check, God\'s presence, fear release, marriage intention, unspoken need, invitation, true thing.',
    meta: ['Daily', 'Voice or type', 'AI parsed'],
    color: 'ashley',
  },
  {
    id: 'ashley_checkin',
    tag: 'Weekly · Saturday',
    person: 'Ashley',
    title: 'Weekly Check-In',
    desc: '7 growth prompts. Most like herself, fell short, God spoke, patterns, covenant presence, temperature, need going forward.',
    meta: ['Saturday', 'Individual', 'Logs to record'],
    color: 'ashley',
  },
  {
    id: 'sunday_closing',
    tag: 'Weekly · Sunday · Joint',
    person: 'Together',
    title: 'Sunday Closing',
    desc: '4 joint prompts. Gratitude, what the week revealed, believing God for, prayer together. AI generates a Covenant Word over them.',
    meta: ['Sunday', 'JP & Ashley together', 'Covenant Word'],
    color: 'gold',
  },
]

const FILTERS = ['All', 'JP', 'Ashley', 'Together']

const colors = {
  blue:   { tag: '#3d6fc4', dot: '#3d6fc4', border: 'rgba(42,82,152,0.5)',   hover: 'rgba(45,100,200,0.06)',  btn: '#2a5298' },
  ashley: { tag: '#7b9fc4', dot: '#7b9fc4', border: 'rgba(74,122,173,0.5)',  hover: 'rgba(74,122,173,0.06)', btn: '#4a7aad' },
  gold:   { tag: '#c9a84c', dot: '#c9a84c', border: 'rgba(201,168,76,0.5)',  hover: 'rgba(201,168,76,0.06)', btn: '#a8872e' },
}

function ToolCard({ tool, active }) {
  const c = colors[tool.color]
  const link = LINKS[tool.id]
  const isWired = link && !link.startsWith('PASTE_')

  const [hovered, setHovered] = useState(false)

  const handleOpen = () => {
    if (isWired) window.open(link, '_blank')
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? c.hover : '#111820',
        border: `1px solid ${hovered ? c.border : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 4,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        transition: 'all 0.2s',
        cursor: isWired ? 'pointer' : 'default',
        position: 'relative',
      }}
    >
      {/* Status badge */}
      <div style={{
        position: 'absolute', top: 16, right: 16,
        background: isWired ? 'rgba(50,180,100,0.15)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${isWired ? 'rgba(50,180,100,0.4)' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 3,
        padding: '2px 8px',
        fontSize: 10, fontWeight: 700,
        letterSpacing: '2px', textTransform: 'uppercase',
        color: isWired ? '#4db87a' : '#4a5568',
      }}>
        {isWired ? 'LIVE' : 'PENDING'}
      </div>

      {/* Tag */}
      <div style={{
        fontSize: 10, fontWeight: 700,
        letterSpacing: '3px', textTransform: 'uppercase',
        color: c.tag, marginBottom: 8,
      }}>
        {tool.tag}
      </div>

      {/* Title */}
      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 22, fontWeight: 600,
        color: '#e8e4da', lineHeight: 1.2,
        marginBottom: 10,
      }}>
        {tool.title}
      </div>

      {/* Desc */}
      <div style={{
        fontSize: 14, color: '#7a8394',
        lineHeight: 1.6, marginBottom: 20,
        paddingRight: 40,
      }}>
        {tool.desc}
      </div>

      {/* Meta */}
      <div style={{
        display: 'flex', gap: 16,
        paddingTop: 16,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        marginBottom: 20,
      }}>
        {tool.meta.map(m => (
          <div key={m} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            fontSize: 12, color: '#4a5568',
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: '50%',
              background: c.dot, flexShrink: 0,
            }} />
            {m}
          </div>
        ))}
      </div>

      {/* Button */}
      <button
        onClick={handleOpen}
        disabled={!isWired}
        style={{
          width: '100%',
          padding: '14px',
          background: isWired ? c.btn : 'transparent',
          border: isWired ? 'none' : '1px solid rgba(255,255,255,0.08)',
          borderRadius: 3,
          fontFamily: "'Barlow', sans-serif",
          fontSize: 12, fontWeight: 700,
          letterSpacing: '2.5px', textTransform: 'uppercase',
          color: isWired ? '#e8e4da' : '#4a5568',
          cursor: isWired ? 'pointer' : 'not-allowed',
          transition: 'all 0.15s',
        }}
      >
        {isWired ? 'OPEN TOOL →' : 'LINK PENDING'}
      </button>
    </div>
  )
}

export default function Hub() {
  const [filter, setFilter] = useState('All')

  const filtered = TOOLS.filter(t => {
    if (filter === 'All') return true
    if (filter === 'Together') return t.person === 'Together'
    return t.person === filter
  })

  const jpTools = filtered.filter(t => t.person === 'JP')
  const ashleyTools = filtered.filter(t => t.person === 'Ashley')
  const jointTools = filtered.filter(t => t.person === 'Together')

  const wiredCount = Object.values(LINKS).filter(l => !l.startsWith('PASTE_')).length

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d1117',
      color: '#e8e4da',
      fontFamily: "'Barlow', sans-serif",
    }}>
      {/* Grain overlay */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', padding: '0 32px 80px' }}>

        {/* HERO */}
        <div style={{
          padding: '52px 0 36px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          marginBottom: 32,
        }}>
          <div style={{
            fontSize: 10, fontWeight: 700,
            letterSpacing: '5px', textTransform: 'uppercase',
            color: '#7a8394', marginBottom: 14,
          }}>
            Sentinel OPS · Covenant Series
          </div>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 'clamp(48px, 7vw, 88px)',
            fontWeight: 700,
            lineHeight: 0.95,
            color: '#e8e4da',
            marginBottom: 20,
          }}>
            Covenant<br /><em style={{ color: '#c9a84c' }}>Tools</em>
          </div>
          <div style={{ fontSize: 15, color: '#7a8394', maxWidth: 480, lineHeight: 1.65 }}>
            Daily and weekly instruments for JP and Ashley Campbell. Scripture anchored, AI parsed, covenant logged.
          </div>

          {/* Status bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 20,
            marginTop: 28, paddingTop: 24,
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ fontSize: 13, color: '#4a5568' }}>
              <span style={{ color: wiredCount === 5 ? '#4db87a' : '#c9a84c', fontWeight: 700 }}>
                {wiredCount}/5
              </span> tools live
            </div>
            <div style={{ height: 14, width: 1, background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ fontSize: 13, color: '#4a5568' }}>5 tools · 3 categories</div>
            <div style={{ height: 14, width: 1, background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ fontSize: 13, color: '#4a5568' }}>Logs to Covenant Record</div>
          </div>
        </div>

        {/* FILTER TABS */}
        <div style={{
          display: 'flex', gap: 6, marginBottom: 36,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          paddingBottom: 0,
        }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '10px 18px',
                background: 'transparent',
                border: 'none',
                borderBottom: filter === f ? '2px solid #c9a84c' : '2px solid transparent',
                fontFamily: "'Barlow', sans-serif",
                fontSize: 12, fontWeight: 600,
                letterSpacing: '2px', textTransform: 'uppercase',
                color: filter === f ? '#e8e4da' : '#4a5568',
                cursor: 'pointer',
                transition: 'all 0.15s',
                marginBottom: -1,
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* JP SECTION */}
        {jpTools.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <div style={{
              fontSize: 10, fontWeight: 700,
              letterSpacing: '5px', textTransform: 'uppercase',
              color: '#7a8394', marginBottom: 16,
            }}>
              ⚔ JP · His Tools
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: 12,
            }}>
              {jpTools.map(t => <ToolCard key={t.id} tool={t} />)}
            </div>
          </div>
        )}

        {/* ASHLEY SECTION */}
        {ashleyTools.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <div style={{
              fontSize: 10, fontWeight: 700,
              letterSpacing: '5px', textTransform: 'uppercase',
              color: '#7a8394', marginBottom: 16,
            }}>
              🌿 Ashley · Her Tools
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: 12,
            }}>
              {ashleyTools.map(t => <ToolCard key={t.id} tool={t} />)}
            </div>
          </div>
        )}

        {/* JOINT SECTION */}
        {jointTools.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <div style={{
              fontSize: 10, fontWeight: 700,
              letterSpacing: '5px', textTransform: 'uppercase',
              color: '#7a8394', marginBottom: 16,
            }}>
              ✦ Together
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: 12,
            }}>
              {jointTools.map(t => <ToolCard key={t.id} tool={t} />)}
            </div>
          </div>
        )}

        {/* COVENANT BAR */}
        <div style={{
          background: '#111820',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 4,
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', gap: 16,
          marginTop: 8,
        }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 28, color: '#c9a84c', flexShrink: 0,
          }}>✦</div>
          <div style={{ fontSize: 14, color: '#7a8394', lineHeight: 1.6 }}>
            <em style={{ color: '#e8e4da' }}>
              "We chose to seek God first, take responsibility for ourselves and respond in humility instead of defensiveness."
            </em>
            <br />Every entry logged to the Covenant Record.
          </div>
        </div>

        {/* FOOTER */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.06)',
          marginTop: 48, paddingTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div style={{
            fontSize: 11, fontWeight: 600,
            letterSpacing: '3px', textTransform: 'uppercase',
            color: '#4a5568',
          }}>
            Sentinel OPS
          </div>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 13, fontStyle: 'italic', color: '#4a5568',
          }}>
            Col 3:23
          </div>
        </div>

      </div>
    </div>
  )
}
