import React, { useState, useEffect } from 'react';
import './VolunteerMatchingForm.css';

const VolunteerMatchingForm = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [matchedEvents, setMatchedEvents] = useState([]);

  useEffect(() => {
    fetch('/volunteerMatching/volunteers')
      .then(response => response.json())
      .then(data => setVolunteers(data));
  }, []);

  const showMatchedEvents = (volunteerId) => {
    fetch(`/volunteerMatching/events/${volunteerId}`)
      .then(response => response.json())
      .then(data => setMatchedEvents(data));
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