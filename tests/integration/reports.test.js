// backend/tests/integration/reports.test.js
const request = require('supertest');
const app = require('../../app'); // your Express app

describe('Reports API Integration', () => {
  test('GET /api/reports returns 200 and array of reports', async () => {
    const res = await request(app).get('/api/reports');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/reports with category filter', async () => {
    const res = await request(app).get('/api/reports?category=sales');
    expect(res.statusCode).toBe(200);
    res.body.data.forEach(report => {
      expect(report.category).toBe('sales');
    });
  });
});
