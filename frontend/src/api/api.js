import axios from 'axios';

const httpClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000',
  headers: { 'Content-Type': 'application/json' },
});

/**
 * List the last-10 message IDs for a given service/account,
 * optionally filtering with a Gmail `q` string.
 *
 * @param {string} service    'gmail'
 * @param {string} account    e.g. 'john'
 * @param {string} [query]    Gmail filter, e.g. "is:starred after:today"
 */
export async function listEmails(service, account, query) {
  // include `q` in the POST body when provided
  const body = query ? { q: query } : {};

  const res = await httpClient.post(
    `/connector/${service}/email.list`,
    body,
    { params: { account } }
  );

  // map the “no tokens” success payload into an error
  if (res.data?.error === 'Account has no tokens') {
    const err = new Error('Authentication required');
    err.authRequired = true;
    throw err;
  }

  return res.data;
}

export async function getEmail(service, account, message_id) {
  const res = await httpClient.post(
    `/connector/${service}/email.get`,
    { message_id },
    { params: { account } }
  );
  return res.data;
}

export async function getAuthUrl(service, account) {
  const res = await httpClient.get(
    `/connector/${service}/auth-url`,
    { params: { account } }
  );
  return res.data.authUrl;
}