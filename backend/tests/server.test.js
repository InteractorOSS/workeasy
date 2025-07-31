// backend/tests/server.test.js
const request = require('supertest');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Mock fs and axios
jest.mock('fs');
jest.mock('axios');

// Require app after mocks
const app = require('../src/server');

describe('Express API Routes', () => {
  const USERS_PATH = path.resolve(__dirname, '../src/../frontend/src/data-store/users.js');
  const PROMPTS_PATH = path.resolve(__dirname, '../src/../frontend/src/data-store/user-prompts.js');

  beforeEach(() => {
    jest.resetAllMocks();
    // Mock users.js export
    jest.doMock(USERS_PATH, () => ({
      default: [{ id: 'u1', name: 'Alice', gmailAccount: 'a@gmail.com', outlookAccount: 'a@outlook.com' }]
    }), { virtual: true });
    // Mock user-prompts.js export
    jest.doMock(PROMPTS_PATH, () => ({
      defaultPrompt: 'Default prompt text',
      dynamicRules: []
    }), { virtual: true });
  });

  describe('GET /accounts', () => {
    it('should return array of user accounts', async () => {
      const res = await request(app).get('/accounts');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].id).toBe('u1');
    });

    it('should handle fs error gracefully', async () => {
      // Force require to throw
      jest.doMock(USERS_PATH, () => { throw new Error('fail'); }, { virtual: true });
      const res = await request(app).get('/accounts');
      expect(res.status).toBe(500);
      expect(res.body.error).toMatch(/Could not load accounts/);
    });
  });

  describe('POST /emails/classify', () => {
    it('should classify emails and return scores', async () => {
      const fakeResults = [{ priorityScore: 5, urgencyScore: 20 }];
      axios.post.mockResolvedValue({ data: { results: fakeResults } });

      const res = await request(app)
        .post('/emails/classify')
        .send({ account: 'a@gmail.com', emails: [{ id: 'm1', body: 'Hello' }] });

      expect(axios.post).toHaveBeenCalled();
      expect(res.status).toBe(200);
      expect(res.body.classifications).toEqual(fakeResults);
    });

    it('should 400 on invalid payload', async () => {
      const res = await request(app).post('/emails/classify').send({ });
      expect(res.status).toBe(400);
    });

    it('should handle classification failure', async () => {
      axios.post.mockRejectedValue(new Error('timeout'));
      const res = await request(app)
        .post('/emails/classify')
        .send({ account: 'a@gmail.com', emails: [] });
      expect(res.status).toBe(502);
      expect(res.body.error).toMatch(/Failed to classify/);
    });
  });

  describe('POST /prompts/update', () => {
    it('should update the prompt file', async () => {
      fs.writeFileSync.mockImplementation(() => {});
      const res = await request(app)
        .post('/prompts/update')
        .send({ dynamicRules: [{ ruleType: 'senderDomain', criterion: 'ex.com', priorityScore: 10, urgencyScore: 50 }] });

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        PROMPTS_PATH,
        expect.stringContaining('"dynamicRules"'),
        'utf-8'
      );
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should 400 on bad payload', async () => {
      const res = await request(app).post('/prompts/update').send({ });
      expect(res.status).toBe(400);
    });

    it('should handle fs failure', async () => {
      fs.writeFileSync.mockImplementation(() => { throw new Error('disk full'); });
      const res = await request(app)
        .post('/prompts/update')
        .send({ dynamicRules: [] });
      expect(res.status).toBe(500);
      expect(res.body.error).toMatch(/Could not update prompt rules/);
    });
  });

  describe('Proxy routes', () => {
    ['gmail/email.list', 'gmail/email.get', 'outlookmail/email.list', 'outlookmail/email.get']
      .forEach((route) => {
        it(`POST /connector/${route} → forwards to Interactor`, async () => {
          const fakeData = { foo: 'bar' };
          axios.mockResolvedValue({ data: fakeData });
          
          const res = await request(app)
            .post(`/connector/${route}?account=test`)
            .send({ any: 'body' });

          expect(axios).toHaveBeenCalled();
          expect(res.body).toEqual(fakeData);
          expect(res.status).toBe(200);
        });

        it(`returns 502 on error for /connector/${route}`, async () => {
          axios.mockRejectedValue(new Error('fail'));
          const res = await request(app)
            .post(`/connector/${route}?account=test`)
            .send({});
          expect(res.status).toBe(502);
        });
      });
  });
});