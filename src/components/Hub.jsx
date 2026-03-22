import React, { useState } from 'react'

const LINKS = {
  jp_launchpad:     '/jp-launchpad.html',
  ashley_launchpad: '/ashley-launchpad.html',
  jp_checkin:       '/jp-checkin.html',
  ashley_checkin:   '/ashley-checkin.html',
  sunday_closing:   '/sunday-closing.html',
  avynn_prayer:     '/avynn-prayer.html',
}

const TOOLS = [
  { id:'jp_launchpad',    tag:'Daily · Morning',        person:'jp',      title:'Morning Launchpad',  desc:"7 soul-search prompts. Voice drop. AI parses into command categories — emotional release, spiritual, identity, relationship.", meta:['Daily','Voice or type','AI parsed'],        color:'cyan' },
  { id:'jp_checkin',      tag:'Weekly · Saturday',      person:'jp',      title:'Weekly Check-In',    desc:"7 accountability prompts. Win, fell short, God spoke, patterns, husband score, temperature, need. Coaching observation generated.", meta:['Saturday','Individual','Logs to record'], color:'cyan' },
  { id:'ashley_launchpad',tag:'Daily · Morning',        person:'ashley',  title:'Morning Reflection', desc:"7 reflective prompts. Heart check, God's presence, fear release, marriage intention, unspoken need, invitation, true thing.", meta:['Daily','Voice or type','AI parsed'],        color:'teal' },
  { id:'ashley_checkin',  tag:'Weekly · Saturday',      person:'ashley',  title:'Weekly Check-In',    desc:"7 growth prompts. Most like herself, fell short, God spoke, patterns, covenant presence, temperature, need going forward.", meta:['Saturday','Individual','Logs to record'], color:'teal' },
  { id:'sunday_closing',  tag:'Weekly · Sunday · Joint',person:'together',title:'Sunday Closing',     desc:"4 joint prompts. Gratitude, what the week revealed, believing God for, prayer together. AI generates a Covenant Word over them.", meta:['Sunday','JP & Ashley together','Covenant Word'], color:'gold' },
  { id:'avynn_prayer',    tag:'Nightly · Together',     person:'together',title:"Avynn's Prayer",     desc:"Drop your hearts about Avynn — her day, what you believe over her. AI builds a customized prayer she repeats line by line with you.", meta:['Every night','JP & Ashley together','Avynn repeats'], color:'gold' },
]

const C = {
  cyan: { tag:'#00d4ff', tagGlow:'rgba(0,212,255,0.5)', dot:'#00d4ff', dotGlow:'rgba(0,212,255,0.5)', border:'rgba(0,212,255,0.15)', borderHover:'rgba(0,212,255,0.5)', cardGlow:'rgba(0,212,255,0.08)', btn:'linear-gradient(135deg,#002840,#0066aa 40%,#00d4ff)', btnShadow:'rgba(0,212,255,0.4)', shimmer:'#00d4ff' },
  teal: { tag:'#38d9c0', tagGlow:'rgba(56,217,192,0.5)', dot:'#38d9c0', dotGlow:'rgba(56,217,192,0.5)', border:'rgba(56,217,192,0.15)', borderHover:'rgba(56,217,192,0.5)', cardGlow:'rgba(56,217,192,0.08)', btn:'linear-gradient(135deg,#002822,#108878 40%,#38d9c0)', btnShadow:'rgba(56,217,192,0.4)', shimmer:'#38d9c0' },
  gold: { tag:'#ffd84a', tagGlow:'rgba(255,216,74,0.5)', dot:'#ffd84a', dotGlow:'rgba(255,216,74,0.5)', border:'rgba(255,216,74,0.15)', borderHover:'rgba(255,216,74,0.55)', cardGlow:'rgba(255,216,74,0.08)', btn:'linear-gradient(135deg,#6b4200,#e89a00 35%,#ffd84a 65%,#ffec80)', btnShadow:'rgba(255,216,74,0.45)', shimmer:'#ffd84a' },
}

export default function Hub() {
  const [filter, setFilter] = useState('all')
  const [hovered, setHovered] = useState(null)

  const shown = filter === 'all' ? TOOLS : TOOLS.filter(t => t.person === filter)
  const jpTools = shown.filter(t => t.person === 'jp')
  const ashleyTools = shown.filter(t => t.person === 'ashley')
  const togetherTools = shown.filter(t => t.person === 'together')

  const styles = {
    body: {
      background:'#03060c', minHeight:'100vh', color:'#eef4ff',
      fontFamily:"'Barlow', sans-serif", fontSize:16, lineHeight:1.7,
      overflowX:'hidden',
    },
    atmoTop: {
      position:'fixed', top:'-30%', left:'50%', transform:'translateX(-50%)',
      width:'140%', height:'60%', pointerEvents:'none', zIndex:0,
      background:'radial-gradient(ellipse at 50% 0%,rgba(255,216,74,0.14) 0%,rgba(0,212,255,0.05) 40%,transparent 65%)',
      filter:'blur(50px)',
    },
    atmoCyan: {
      position:'fixed', top:'20%', left:'-15%', width:'55%', height:'60%',
      pointerEvents:'none', zIndex:0,
      background:'radial-gradient(ellipse,rgba(0,212,255,0.08) 0%,transparent 60%)',
      filter:'blur(70px)',
    },
    atmoTeal: {
      position:'fixed', bottom:'10%', right:'-10%', width:'50%', height:'50%',
      pointerEvents:'none', zIndex:0,
      background:'radial-gradient(ellipse,rgba(56,217,192,0.07) 0%,transparent 60%)',
      filter:'blur(70px)',
    },
    page: { position:'relative', zIndex:1, maxWidth:620, margin:'0 auto', padding:'0 22px 100px' },
    hero: { padding:'64px 0 48px', marginBottom:44, borderBottom:'1px solid rgba(255,216,74,0.12)', position:'relative' },
    heroDivider: { position:'absolute', bottom:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,#00aaee 25%,#ffd84a 50%,#00aaee 75%,transparent)', opacity:0.6 },
    eyebrow: { fontSize:10, fontWeight:700, letterSpacing:7, textTransform:'uppercase', color:'#00d4ff', opacity:0.8, marginBottom:18, textShadow:'0 0 20px rgba(0,212,255,0.5)', display:'block' },
    heroTitle: { fontFamily:"'Playfair Display', serif", fontWeight:900, fontSize:'clamp(56px,10vw,88px)', lineHeight:0.9, marginBottom:24 },
    t1: { display:'block', color:'#eef4ff' },
    t2: { display:'block', fontStyle:'italic', background:'linear-gradient(110deg,#e89a00 0%,#f5b820 20%,#ffd84a 45%,#ffec80 60%,#ffd84a 75%,#f5b820 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', filter:'drop-shadow(0 0 40px rgba(255,216,74,0.7)) drop-shadow(0 0 80px rgba(255,216,74,0.4))', animation:'goldPulse 3s ease-in-out infinite alternate' },
    heroSub: { fontSize:15, color:'#6a7a94', maxWidth:440, marginBottom:28, lineHeight:1.75 },
    stats: { display:'flex', gap:24, flexWrap:'wrap' },
    stat: { fontSize:12, color:'#2a3548', display:'flex', alignItems:'center', gap:7 },
    sdot: { width:5, height:5, borderRadius:'50%', background:'#ffd84a', boxShadow:'0 0 10px #ffd84a,0 0 20px rgba(255,216,74,0.5)' },
    statB: { color:'#ffd84a', fontWeight:700, textShadow:'0 0 14px rgba(255,216,74,0.6)' },
    filters: { display:'flex', gap:2, marginBottom:40, borderBottom:'1px solid rgba(0,212,255,0.1)' },
    fbtn: (active) => ({ padding:'11px 18px', background:'transparent', border:'none', borderBottom: active ? '2px solid #00d4ff' : '2px solid transparent', marginBottom:-1, fontFamily:"'Barlow', sans-serif", fontSize:11, fontWeight:700, letterSpacing:3, textTransform:'uppercase', color: active ? '#00d4ff' : '#2a3548', cursor:'pointer', transition:'all 0.2s', textShadow: active ? '0 0 20px rgba(0,212,255,0.8),0 0 40px rgba(0,212,255,0.4)' : 'none' }),
    slabel: { fontSize:10, fontWeight:700, letterSpacing:5, textTransform:'uppercase', color:'#6a7a94', marginBottom:14, display:'flex', alignItems:'center', gap:14 },
    slabelLine: { flex:1, height:1, background:'linear-gradient(90deg,rgba(0,212,255,0.2),transparent)' },
    sdiv: (color) => ({ display:'flex', alignItems:'center', gap:14, margin:'40px 0 16px' }),
    sdivLine: (c) => ({ flex:1, height:1, background:`linear-gradient(90deg,transparent,${c},transparent)` }),
    sdivLabel: { fontSize:10, fontWeight:700, letterSpacing:4, textTransform:'uppercase', color:'#6a7a94', whiteSpace:'nowrap' },
    card: (t, isHov) => {
      const c = C[t.color]
      return {
        background:'#070d16', border:`1px solid ${isHov ? c.borderHover : c.border}`,
        borderRadius:4, padding:26, marginBottom:12, cursor:'pointer', position:'relative', overflow:'hidden',
        transition:'all 0.3s cubic-bezier(0.34,1.1,0.64,1)',
        transform: isHov ? 'translateY(-3px) scale(1.002)' : 'none',
        boxShadow: isHov ? `0 12px 50px rgba(0,0,0,0.6),0 0 40px ${c.cardGlow},0 0 80px ${c.cardGlow}` : 'none',
      }
    },
    badge: { position:'absolute', top:18, right:18, fontSize:9, fontWeight:700, letterSpacing:2.5, textTransform:'uppercase', padding:'3px 9px', borderRadius:2, background:'rgba(0,255,120,0.08)', border:'1px solid rgba(0,255,120,0.3)', color:'#00ff88', boxShadow:'0 0 16px rgba(0,255,120,0.15)' },
    ctag: (c) => ({ fontSize:10, fontWeight:700, letterSpacing:3, textTransform:'uppercase', marginBottom:9, color:C[c].tag, textShadow:`0 0 16px ${C[c].tagGlow}` }),
    ctitle: { fontFamily:"'Playfair Display', serif", fontSize:26, fontWeight:700, color:'#eef4ff', marginBottom:10, lineHeight:1.2 },
    cdesc: { fontSize:14, color:'#6a7a94', lineHeight:1.65, paddingRight:60, marginBottom:20 },
    cmeta: { display:'flex', gap:16, paddingTop:14, borderTop:'1px solid rgba(255,255,255,0.04)', marginBottom:20 },
    cmi: { display:'flex', alignItems:'center', gap:6, fontSize:11, color:'#2a3548' },
    cdot: (c) => ({ width:4, height:4, borderRadius:'50%', background:C[c].dot, boxShadow:`0 0 8px ${C[c].dot},0 0 16px ${C[c].dotGlow}` }),
    btn: (c, isHov) => ({
      width:'100%', padding:15, border:'none', borderRadius:3,
      fontFamily:"'Barlow', sans-serif", fontSize:11, fontWeight:800, letterSpacing:3, textTransform:'uppercase',
      cursor:'pointer', transition:'all 0.25s', position:'relative', overflow:'hidden',
      background: C[c].btn, color:'#03060c',
      boxShadow: isHov ? `0 6px 40px ${C[c].btnShadow},0 0 80px rgba(255,216,74,0.1),inset 0 1px 0 rgba(255,255,255,0.35)` : `0 4px 24px ${C[c].btnShadow},0 0 50px rgba(0,0,0,0),inset 0 1px 0 rgba(255,255,255,0.25)`,
      transform: isHov ? 'translateY(-2px)' : 'none',
    }),
    covBar: { marginTop:52, background:'linear-gradient(135deg,rgba(6,12,20,0.97),rgba(3,6,10,0.99))', border:'1px solid rgba(255,216,74,0.2)', borderRadius:4, padding:28, position:'relative', overflow:'hidden', boxShadow:'0 0 60px rgba(255,216,74,0.08),inset 0 1px 0 rgba(255,216,74,0.15)' },
    covTop: { position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent 5%,#00aaee 25%,#ffd84a 50%,#00aaee 75%,transparent 95%)', opacity:0.8 },
    covInner: { display:'flex', alignItems:'flex-start', gap:18 },
    covMark: { fontFamily:"'Playfair Display', serif", fontSize:40, flexShrink:0, marginTop:2, background:'linear-gradient(135deg,#ffec80,#ffd84a,#f5b820)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', filter:'drop-shadow(0 0 20px rgba(255,216,74,0.8)) drop-shadow(0 0 50px rgba(255,216,74,0.5))' },
    covText: { fontSize:14, color:'#6a7a94', lineHeight:1.75 },
    covEm: { display:'block', fontStyle:'italic', fontFamily:"'Playfair Display', serif", fontSize:16, color:'#eef4ff', marginBottom:8 },
    foot: { borderTop:'1px solid rgba(0,212,255,0.08)', marginTop:52, paddingTop:24, display:'flex', justifyContent:'space-between', alignItems:'center' },
    footBrand: { fontSize:10, fontWeight:700, letterSpacing:4, textTransform:'uppercase', color:'#2a3548' },
    footVerse: { fontFamily:"'Playfair Display', serif", fontSize:13, fontStyle:'italic', color:'#f5b820', textShadow:'0 0 16px rgba(255,216,74,0.4)' },
  }

  const Section = ({label, tools, divColor, icon}) => {
    if (!tools.length) return null
    return (
      <>
        {label === '⚔ JP · His Tools' ? (
          <div style={styles.slabel}>{label}<div style={styles.slabelLine}></div></div>
        ) : (
          <div style={styles.sdiv()}>
            <div style={styles.sdivLine(divColor)}></div>
            <div style={styles.sdivLabel}>{label}</div>
            <div style={styles.sdivLine(divColor)}></div>
          </div>
        )}
        {tools.map(t => (
          <ToolCard key={t.id} tool={t} />
        ))}
      </>
    )
  }

  const ToolCard = ({tool: t}) => {
    const isHov = hovered === t.id
    const link = LINKS[t.id]
    return (
      <div
        style={styles.card(t, isHov)}
        onMouseEnter={() => setHovered(t.id)}
        onMouseLeave={() => setHovered(null)}
        onClick={() => link && (window.location.href = link)}
      >
        <div style={styles.badge}>LIVE</div>
        <div style={styles.ctag(t.color)}>{t.tag}</div>
        <div style={styles.ctitle}>{t.title}</div>
        <div style={styles.cdesc}>{t.desc}</div>
        <div style={styles.cmeta}>
          {t.meta.map((m,i) => (
            <div key={i} style={styles.cmi}>
              <div style={styles.cdot(t.color)}></div>
              {m}
            </div>
          ))}
        </div>
        <button style={styles.btn(t.color, isHov)} onClick={e => {e.stopPropagation();link && (window.location.href=link)}}>
          Open Tool →
        </button>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Barlow:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{margin:0;background:#03060c;}
        @keyframes goldPulse{
          0%{filter:drop-shadow(0 0 25px rgba(255,216,74,0.6)) drop-shadow(0 0 60px rgba(255,216,74,0.3));}
          100%{filter:drop-shadow(0 0 50px rgba(255,236,128,0.9)) drop-shadow(0 0 100px rgba(255,216,74,0.5));}
        }
      `}</style>
      <div style={styles.body}>
        <div style={styles.atmoTop}></div>
        <div style={styles.atmoCyan}></div>
        <div style={styles.atmoTeal}></div>
        <div style={styles.page}>

          {/* HERO */}
          <div style={styles.hero}>
            <div style={styles.heroDivider}></div>
            <span style={styles.eyebrow}>Sentinel OPS · Covenant Series</span>
            <div style={styles.heroTitle}>
              <span style={styles.t1}>Covenant</span>
              <span style={styles.t2}>Tools</span>
            </div>
            <div style={styles.heroSub}>Daily and weekly instruments for JP and Ashley Campbell. Scripture anchored, AI parsed, covenant logged.</div>
            <div style={styles.stats}>
              <div style={styles.stat}><div style={styles.sdot}></div><span style={styles.statB}>6</span>/6 tools live</div>
              <div style={styles.stat}><div style={styles.sdot}></div>Logs to Covenant Record</div>
              <div style={styles.stat}><div style={styles.sdot}></div>AI parsed</div>
            </div>
          </div>

          {/* FILTERS */}
          <div style={styles.filters}>
            {['all','jp','ashley','together'].map(f => (
              <button key={f} style={styles.fbtn(filter===f)} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f === 'jp' ? 'JP' : f === 'ashley' ? 'Ashley' : 'Together'}
              </button>
            ))}
          </div>

          {/* SECTIONS */}
          <Section label="⚔ JP · His Tools" tools={jpTools} divColor="rgba(0,212,255,0.3)" />
          <Section label="🌿 Ashley · Her Tools" tools={ashleyTools} divColor="rgba(56,217,192,0.35)" />
          <Section label="✦ Together" tools={togetherTools} divColor="rgba(255,216,74,0.35)" />

          {/* COVENANT BAR */}
          <div style={styles.covBar}>
            <div style={styles.covTop}></div>
            <div style={styles.covInner}>
              <div style={styles.covMark}>✦</div>
              <div style={styles.covText}>
                <em style={styles.covEm}>"We chose to seek God first, take responsibility for ourselves and respond in humility instead of defensiveness."</em>
                Every entry logged to the Covenant Record.
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div style={styles.foot}>
            <div style={styles.footBrand}>Sentinel OPS</div>
            <div style={styles.footVerse}>Col 3:23</div>
          </div>

        </div>
      </div>
    </>
  )
}
