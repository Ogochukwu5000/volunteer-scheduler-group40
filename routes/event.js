const express = require('express');
const router = express.Router();

const events = [
  { id: 1, name: 'Community Kitchen', requiredSkills: ['Cooking'], location: 'Location1', urgency: 'High', details: 'Details1' },
  { id: 2, name: 'First Aid Training', requiredSkills: ['First Aid'], location: 'Location2', urgency: 'Medium', details: 'Details2' }
];

router.get('/', (req, res) => {
  res.status(200).json(events);
});

router.post('/', (req, res) => {
  const { name, requiredSkills, location, urgency, details } = req.body;
  if (!name || !requiredSkills || !location || !urgency || !details) {
    return res.status(400).send('All fields are required');
  }
  events.push({ id: events.length + 1, name, requiredSkills, location, urgency, details });
  res.status(201).send('Event created');
});

module.exports = router;