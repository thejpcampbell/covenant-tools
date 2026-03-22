export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { tool, drop, scripture, date, prompts } = req.body;

    const SYSTEMS = {
      jp_launchpad: `You are the Sentinel OPS AI for JP Campbell — Sales Director, Lead Closer, husband, man of faith anchored in Colossians 3:23. You know JP deeply. He is a high-performer currently in active covenant restoration with his wife Ashley after a painful season. He carries the tension of being the one who caused hurt while also being the one showing up hardest to fix it. He processes out loud — raw, unfiltered, rambling, voice-to-text. Read everything. Extract the full emotional and spiritual weight — not just what he says but what he means. Categories should capture SUBSTANCE — full sentences, real content, emotional depth. emotional_release: everything he is carrying, feeling, holding, resisting — all of it in full detail. spiritual: what he senses from God, where he feels presence or absence, what conviction is moving in him. identity_declaration_category: the full conviction of who he is deciding to be today. personal_relationship: everything about Ashley, the covenant, what he needs, what he is giving, what is unresolved. coaching_observation: 3-5 sentences minimum — speak to his specific patterns, the tension between performance and presence, between leading and controlling. Direct. No softening. Speak like a coach who knows his full history. declaration: one powerful sentence he can carry all day. Return ONLY a raw JSON object — no markdown, no backticks, no preamble. Start with { and end with }.`,
      ashley_launchpad: `You are the Sentinel OPS AI for Ashley Campbell — wife, woman of faith in active covenant restoration with JP. She is beginning to rebuild, starting a new job, navigating a structured restoration plan. She may be guarded, tender, hopeful, exhausted. Her drops may be structured or freestyle. Read everything with warmth and depth. heart_check: full emotional texture of how she is arriving. what_god_is_speaking: what she senses from God, where she felt His presence, what He is speaking. relationship_pulse: everything about JP and the covenant — what she feels, needs, opens to or guards against. who_i_am_becoming: what identity is growing in her. what_i_am_releasing: fear, old pattern, wound, or weight she is letting go. coaching_observation: 3-5 sentences minimum — her patterns, where she holds back, where she is growing, what she needs to hear with gentleness and honesty. declaration: one true sentence she can carry. Return ONLY a raw JSON object — no markdown, no backticks, no preamble. Start with { and end with }.`,
      jp_checkin: `You are the Sentinel OPS AI for JP Campbell doing his weekly Saturday check-in. You know his patterns, his growth edges, his tendency to perform when fear is present. Drop may be structured or freestyle. Extract full substance for each field — complete thoughts, emotional depth. coaching_observation: 3-5 sentences, direct, specific to what surfaced this week. Name the pattern. Call out the growth. No softening. Return ONLY a raw JSON object — no markdown, no backticks. Start with { and end with }.`,
      ashley_checkin: `You are the Sentinel OPS AI for Ashley Campbell doing her weekly Saturday check-in. You know her growth, her patterns, where she holds back. Drop may be structured or freestyle. Extract full substance for each field. coaching_observation: 3-5 sentences, warm but honest, specific to this week. Affirm her growth. Name what she needs to hear. Return ONLY a raw JSON object — no markdown, no backticks. Start with { and end with }.`,
      sunday_closing: `You are the Sentinel OPS AI receiving JP and Ashley Campbell's Sunday Closing — a sacred joint moment. You know them both and their restoration story. Receive their drop with gravity and warmth. Extract full substance. covenant_word: 4-6 sentences minimum — a specific earned word of encouragement and vision spoken over them as a couple. Reference what they actually shared. Speak to where they are in the restoration. Make it feel written specifically for them. Return ONLY a raw JSON object — no markdown, no backticks. Start with { and end with }.`,
    };

    const SCHEMAS = {
      jp_launchpad: '{"emotional_release":"","spiritual":"","identity_declaration_category":"","personal_relationship":"","scripture_mention":"","declaration":"","coaching_observation":""}',
      ashley_launchpad: '{"heart_check":"","what_god_is_speaking":"","relationship_pulse":"","who_i_am_becoming":"","what_i_am_releasing":"","scripture_mention":"","declaration":"","coaching_observation":""}',
      jp_checkin: '{"ci_win":"","ci_fell_short":"","ci_god_spoke":"","ci_pattern":"","ci_husband":"","ci_temp":"","ci_temp_note":"","ci_need":"","declaration":"","coaching_observation":""}',
      ashley_checkin: '{"ci_win":"","ci_fell_short":"","ci_god_spoke":"","ci_pattern":"","ci_covenant":"","ci_temp":"","ci_temp_note":"","ci_need":"","declaration":"","coaching_observation":""}',
      sunday_closing: '{"gratitude":"","revelation":"","believing_for":"","prayer":"","covenant_word":""}',
    };

    // Avynn prayer passes its own system/user prompts directly
    if (tool === 'avynn_prayer') {
      const system = req.body._system;
      const userMsg = req.body._user;
      if (!system || !userMsg) return res.status(400).json({ error: 'Missing system/user for avynn_prayer' });
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 2000, system, messages: [{ role: 'user', content: userMsg }] }),
      });
      const data = await response.json();
      if (!response.ok || data.error) return res.status(500).json({ error: data.error?.message || 'API error' });
      const raw = data.content?.filter(b => b.type === 'text').map(b => b.text).join('').trim() || '';
      let parsed = null;
      for (const fn of [
        () => JSON.parse(raw),
        () => JSON.parse(raw.replace(/```json|```/g, '').trim()),
        () => { const m = raw.match(/\{[\s\S]*\}/); return JSON.parse(m[0]); },
        () => { const s = raw.indexOf('{'), e = raw.lastIndexOf('}'); return JSON.parse(raw.slice(s, e+1)); },
      ]) { try { parsed = fn(); break; } catch(e) {} }
      if (!parsed) parsed = { lines: ['God thank You for tonight.', 'You love Avynn completely.', 'Watch over her as she sleeps.', 'She is Yours.', 'Amen.'], blessing_word: 'Sleep in peace tonight, sweet girl.', scripture_note: '' };
      return res.status(200).json({ success: true, data: parsed });
    }

    if (!SYSTEMS[tool]) return res.status(400).json({ error: 'Unknown tool: ' + tool });

    const promptList = prompts?.map((p, i) => `${i+1}. ${p}`).join('\n') || '';
    const userMsg = `Date: ${date}
Scripture: "${scripture?.text}" — ${scripture?.ref}

${promptList ? `Prompts they may have spoken to (extract by theme, not order — drop may be freestyle):\n${promptList}\n\n` : ''}Raw drop (may be freestyle, voice-to-text, rambling — extract the signal from the noise):
"${drop}"

Fill every field you can find evidence for. Empty string if nothing. CRITICAL INSTRUCTION: Do NOT compress, summarize, or leave anything out. If they spoke for 5-10 minutes, the output should reflect that depth. Each category should be as long as it needs to be to capture everything they said that belongs there. Use their actual words and phrases where they carry weight. Preserve the emotional texture — the hesitations, the contradictions, the breakthroughs. For emotional_release: capture everything — name every weight, fear, resentment, grief, tension they expressed. Do not leave a single thing they carried on the table. For spiritual: preserve every spiritual observation, every sense of God's presence or absence, every scripture connection. For personal_relationship: capture every nuance about the marriage, the restoration, the needs, the fears, the hopes. For coaching_observation: minimum 4-6 sentences, written as a coach who has heard every word. Speak to the specific patterns, the specific tensions, the specific growth edges visible in THIS drop. For declaration: one sentence that carries the weight of everything they just processed.

Return ONLY this JSON structure filled in, nothing else:
${SCHEMAS[tool]}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: SYSTEMS[tool],
        messages: [{ role: 'user', content: userMsg }],
      }),
    });

    const data = await response.json();
    if (!response.ok || data.error) return res.status(500).json({ error: data.error?.message || 'API error ' + response.status });

    const raw = data.content?.filter(b => b.type === 'text').map(b => b.text).join('').trim() || '';

    // 4-strategy JSON extraction
    let parsed = null;
    for (const fn of [
      () => JSON.parse(raw),
      () => JSON.parse(raw.replace(/```json|```/g, '').trim()),
      () => { const m = raw.match(/\{[\s\S]*\}/); return JSON.parse(m[0]); },
      () => { const s = raw.indexOf('{'), e = raw.lastIndexOf('}'); return JSON.parse(raw.slice(s, e+1)); },
    ]) { try { parsed = fn(); break; } catch(e) {} }

    if (!parsed) {
      parsed = { coaching_observation: raw.substring(0, 400) };
      for (const [, k, v] of raw.matchAll(/"(\w+)"\s*:\s*"((?:[^"\\]|\\.)*)"/g)) parsed[k] = v;
    }

    return res.status(200).json({ success: true, data: parsed });

  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
