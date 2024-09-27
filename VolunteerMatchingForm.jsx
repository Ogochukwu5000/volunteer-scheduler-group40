import React, { useState } from 'react';
import './VolunteerMatchingForm.css';
const VolunteerMatchingForm = () => {
  const [matchedEvents, setMatchedEvents] = useState([]);

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

  const showMatchedEvents = (volunteerId) => {
    setMatchedEvents(events[volunteerId] || []);
  };

  return (
    <div>
      <h1>Volunteer Matching Form</h1>
      <div className="container">
        <div className="column" id="volunteer-list">
          <h2>Volunteers</h2>
          {volunteers.map(volunteer => (
            <div key={volunteer.id} className="volunteer" onClick={() => showMatchedEvents(volunteer.id)}>
              <strong>{volunteer.name}</strong>
              <p>Skills: {volunteer.skills}</p>
              <p>Available Dates: {volunteer.dates}</p>
            </div>
          ))}
        </div>
        <div className="column" id="event-list">
          <h2>Matched Events</h2>
          {matchedEvents.map((event, index) => (
            <div key={index} className="event">
              <strong>{event.name}</strong>
              <p>Date: {event.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VolunteerMatchingForm;