const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const eventRoutes = require('../routes/event');

const app = express();
app.use(bodyParser.json());
app.use('/event', eventRoutes);

describe('Event Management Module', () => {
  it('should get all events', async () => {
    const res = await request(app).get('/event');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should create a new event', async () => {
    const newEvent = {
      name: 'New Event',
      requiredSkills: ['Skill1'],
      location: 'New Location',
      urgency: 'Low',
      details: 'New Details'
    };
    const res = await request(app).post('/event').send(newEvent);
    expect(res.statusCode).toEqual(201);
    expect(res.text).toEqual('Event created');
  });

  it('should return 400 if required fields are missing', async () => {
    const newEvent = {
      name: 'Incomplete Event'
    };
    const res = await request(app).post('/event').send(newEvent);
    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('All fields are required');
  });
});