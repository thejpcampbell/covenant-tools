export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { tool, drop, scripture, date, prompts } = req.body;

    const SYSTEMS = {
      jp_launchpad: `You are the Sentinel OPS AI for JP Campbell — Sales Director, Lead Closer, husband, man of faith anchored in Colossians 3:23. JP drops raw unfiltered morning voice transcripts. They may be structured, freestyle, rambling, voice-to-text with broken grammar, or stream of consciousness. Your job is to read whatever he gives you, extract meaning, and organize it. Read between the lines. Return ONLY a raw JSON object — no markdown, no backticks, no preamble. Start your response with { and end with }.`,
      ashley_launchpad: `You are the Sentinel OPS AI for Ashley Campbell — wife, woman of faith in active covenant restoration. Ashley drops raw unfiltered morning reflections. They may be structured or completely freestyle. Read with warmth and care. Extract meaning even from messy drops. Return ONLY a raw JSON object — no markdown, no backticks, no preamble. Start with { and end with }.`,
      jp_checkin: `You are the Sentinel OPS AI for JP Campbell doing his weekly Saturday check-in. Drop may be structured or completely freestyle. Extract what belongs in each field. Direct, no softening. Return ONLY a raw JSON object — no markdown, no backticks. Start with { and end with }.`,
      ashley_checkin: `You are the Sentinel OPS AI for Ashley Campbell doing her weekly Saturday check-in. Drop may be structured or freestyle. Reflective, growth-oriented. Return ONLY a raw JSON object — no markdown, no backticks. Start with { and end with }.`,
      sunday_closing: `You are the Sentinel OPS AI receiving JP and Ashley Campbell's Sunday Closing. Drop may be structured or freestyle. Receive with gravity and warmth. Return ONLY a raw JSON object — no markdown, no backticks. Start with { and end with }.`,
    };

    const SCHEMAS = {
      jp_launchpad: '{"emotional_release":"","spiritual":"","identity_declaration_category":"","personal_relationship":"","scripture_mention":"","declaration":"","coaching_observation":""}',
      ashley_launchpad: '{"heart_check":"","what_god_is_speaking":"","relationship_pulse":"","who_i_am_becoming":"","what_i_am_releasing":"","scripture_mention":"","declaration":"","coaching_observation":""}',
      jp_checkin: '{"ci_win":"","ci_fell_short":"","ci_god_spoke":"","ci_pattern":"","ci_husband":"","ci_temp":"","ci_temp_note":"","ci_need":"","declaration":"","coaching_observation":""}',
      ashley_checkin: '{"ci_win":"","ci_fell_short":"","ci_god_spoke":"","ci_pattern":"","ci_covenant":"","ci_temp":"","ci_temp_note":"","ci_need":"","declaration":"","coaching_observation":""}',
      sunday_closing: '{"gratitude":"","revelation":"","believing_for":"","prayer":"","covenant_word":""}',
    };

    if (!SYSTEMS[tool]) return res.status(400).json({ error: 'Unknown tool: ' + tool });

    const promptList = prompts?.map((p, i) => `${i+1}. ${p}`).join('\n') || '';
    const userMsg = `Date: ${date}
Scripture: "${scripture?.text}" — ${scripture?.ref}

${promptList ? `Prompts they may have spoken to (extract by theme, not order — drop may be freestyle):\n${promptList}\n\n` : ''}Raw drop (may be freestyle, voice-to-text, rambling — extract the signal from the noise):
"${drop}"

Fill every field you can find evidence for. Empty string if nothing. For coaching_observation: 2-3 sentences specific to this person's patterns. For declaration: one identity sentence distilled from the drop.

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
        max_tokens: 1200,
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
