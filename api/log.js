export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const SHEETS = 'https://script.google.com/a/macros/thefrankdeluca.com/s/AKfycbxMyTpRHFyOjxLBLKapsiDceb8J3hThcVXxQ6a3xJWdSU5MUHJwVweHaeppFhHzpHLIwQ/exec';

  try {
    const payload = req.method === 'POST' ? req.body : { type: 'TEST', timestamp: new Date().toISOString(), date: 'Test', message: 'Connection test from Vercel' };

    const response = await fetch(SHEETS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    const text = await response.text();
    return res.status(200).json({
      success: true,
      sheets_status: response.status,
      sheets_ok: response.ok,
      sheets_response: text.substring(0, 500),
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
