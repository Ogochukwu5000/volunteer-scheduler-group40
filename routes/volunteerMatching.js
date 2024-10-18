const express = require('express');
const router = express.Router();

const volunteers = [
  { id: 'volunteer1', name: 'John Doe', skills: 'Cooking, First Aid', dates: '2023-10-01, 2023-10-15' },
  { id: 'volunteer2', name: 'Jane Smith', skills: 'Teaching, Driving', dates: '2023-10-05, 2023-10-20' },
  { id: 'volunteer3', name: 'Emily Johnson', skills: 'Painting, Childcare', dates: '2023-10-10, 2023-10-25' },
  { id: 'volunteer4', name: 'Michael Brown', skills: 'Carpentry, Plumbing', dates: '2023-10-12, 2023-10-22' },
  { id: 'volunteer5', name: 'Sarah Davis', skills: 'Gardening, Event Planning', dates: '2023-10-08, 2023-10-18' },
];

const events = {
  'volunteer1': [
    { name: 'Community Kitchen', date: '2023-10-01' },
    { name: 'First Aid Training', date: '2023-10-15' }
  ],
  'volunteer2': [
    { name: 'Teaching Workshop', date: '2023-10-05' },
    { name: 'Driving Assistance', date: '2023-10-20' }
  ],
  'volunteer3': [
    { name: 'Kids Art Class', date: '2023-10-10' },
    { name: 'Childcare Support', date: '2023-10-25' }
  ],
  'volunteer4': [
    { name: 'Carpentry Workshop', date: '2023-10-12' },
    { name: 'Plumbing Basics', date: '2023-10-22' }
  ],
  'volunteer5': [
    { name: 'Community Garden Day', date: '2023-10-08' },
    { name: 'Event Planning Seminar', date: '2023-10-18' }
  ]
};

router.get('/volunteers', (req, res) => {
  res.status(200).json(volunteers);
});

router.get('/events/:volunteerId', (req, res) => {
  const volunteerEvents = events[req.params.volunteerId] || [];
  res.status(200).json(volunteerEvents);
});

module.exports = router;