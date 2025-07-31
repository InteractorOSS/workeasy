require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const axios   = require('axios');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000' }));

// ─── Auth URL endpoint ─────────────────────────────────────────────────────────
app.get('/connector/:service/auth-url', async (req, res) => {
  const { service } = req.params;
  const account     = req.query.account;
  if (service !== 'gmail') {
    return res.status(400).json({ error: 'Invalid service.' });
  }

  try {
    const response = await axios.get(
      `${process.env.INTERACTOR_ENDPOINT}connector/interactor/${service}/auth-url?account=${encodeURIComponent(account)}`,
      { headers: { 'x-api-key': process.env.INTERACTOR_API_KEY } }
    );
    res.json({ authUrl: response.data });
  } catch (err) {
    console.error('Auth-URL fetch failed:', err.response?.data || err.message);
    res.status(502).json({ error: 'Failed to fetch auth URL.' });
  }
});

// ─── Gmail proxy ────────────────────────────────────────────────────────────────
const proxyConnector = (service) => async (req, res) => {
  const account = req.query.account;
  const action  = req.path.includes('email.list') ? 'email.list' : 'email.get';

  try {
    const upstream = await axios.post(
      `${process.env.INTERACTOR_ENDPOINT}connector/interactor/${service}/action/${action}/execute?account=${encodeURIComponent(account)}`,
      req.body,
      { headers: { 'x-api-key': process.env.INTERACTOR_API_KEY } }
    );

    // handle “not authenticated” case
    if (upstream.data?.error === 'Account has no tokens') {
      return res.status(401).json({ authRequired: true });
    }

    // Interactor nests payload under `output`
    return res.json(upstream.data.output || upstream.data);
  } catch (err) {
    const data = err.response?.data;
    if (data?.error === 'Account has no tokens') {
      return res.status(401).json({ authRequired: true });
    }
    console.error('Proxy error:', err.response?.data || err.message);
    return res.status(502).json({ error: `Failed to ${action} from ${service}.` });
  }
};

// ─── Disconnect / Revoke Gmail tokens ────────────────────────────────────────
app.delete('/connector/:service/credential', async (req, res) => {
  const { service } = req.params;
  const account     = req.query.account;

  if (service !== 'gmail') {
    return res.status(400).json({ error: 'Invalid service.' });
  }

  try {
    await axios.delete(
      `${process.env.INTERACTOR_ENDPOINT}connector/interactor/${service}/credential?account=${encodeURIComponent(account)}`,
      { headers: { 'x-api-key': process.env.INTERACTOR_API_KEY } }
    );
    return res.json({ success: true });
  } catch (err) {
    console.error('Disconnect Gmail failed:', err.response?.data || err.message);
    return res.status(502).json({ error: 'Failed to revoke Gmail credentials.' });
  }
});

app.post('/connector/gmail/email.list', proxyConnector('gmail'));
app.post('/connector/gmail/email.get',  proxyConnector('gmail'));

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Backend listening on http://localhost:${PORT}`));