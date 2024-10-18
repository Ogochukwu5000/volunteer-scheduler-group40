const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const volunteerMatchingRoutes = require('../routes/volunteerMatching');

const app = express();
app.use(bodyParser.json());
app.use('/volunteerMatching', volunteerMatchingRoutes);

describe('Volunteer Matching Module', () => {
  it('should get all volunteers', async () => {
    const res = await request(app).get('/volunteerMatching/volunteers');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get events for a specific volunteer', async () => {
    const res = await request(app).get('/volunteerMatching/events/volunteer1');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return an empty array if no events are found for a volunteer', async () => {
    const res = await request(app).get('/volunteerMatching/events/nonexistentVolunteer');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(0);
  });
});