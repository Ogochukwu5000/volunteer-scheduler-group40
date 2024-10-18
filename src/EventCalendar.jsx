import React, { useState, useEffect } from 'react';
import './EventCalendar.css';

const EventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [events, setEvents] = useState([]);
  const [calendarTable, setCalendarTable] = useState([]);

  useEffect(() => {
    fetch('/event')
      .then(response => response.json())
      .then(data => setEvents(data));
  }, []);

  useEffect(() => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    setCalendar({ daysInMonth, firstDay });
  }, [currentDate, events]);

  const setCalendar = ({ daysInMonth, firstDay }) => {
    const calendarTable = [];
    let row = [];
    for (let i = 0; i < firstDay; i++) {
      row.push(<td key={`empty-${i}`}></td>);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      if (row.length === 7) {
        calendarTable.push(<tr key={`row-${calendarTable.length}`}>{row}</tr>);
        row = [];
      }
      row.push(
        <td key={day}>
          <div className="date-number">{day}</div>
          <button className="add-event" onClick={() => openModal(day)}>+</button>
          {events.filter(event => event.day === day).map((event, index) => (
            <div key={index} className={`event-bar ${event.urgency}`} onClick={() => showEventDetails(event)}>
              {event.name}
            </div>
          ))}
        </td>
      );
    }
    if (row.length > 0) {
      calendarTable.push(<tr key={`row-${calendarTable.length}`}>{row}</tr>);
    }
    setCalendarTable(calendarTable);
  };

  const openModal = (day) => {
    console.log(`Opening modal for day: ${day}`); // Add this line for debugging
    setModalContent(
      <div>
        <span className="close" onClick={() => setModalVisible(false)}>&times;</span>
        <h2>Add Event</h2>
        <form onSubmit={(e) => handleFormSubmit(e, day)}>
          <input type="text" name="eventName" placeholder="Event Name" required />
          <textarea name="eventDescription" placeholder="Event Description" required></textarea>
          <input type="text" name="location" placeholder="Location" required />
          <div className="checkbox-columns">
            <label><input type="checkbox" name="requiredSkills" value="Cooking" /> Cooking</label>
            <label><input type="checkbox" name="requiredSkills" value="First Aid" /> First Aid</label>
            <label><input type="checkbox" name="requiredSkills" value="Teaching" /> Teaching</label>
            <label><input type="checkbox" name="requiredSkills" value="Driving" /> Driving</label>
            <label><input type="checkbox" name="requiredSkills" value="Painting" /> Painting</label>
            <label><input type="checkbox" name="requiredSkills" value="Childcare" /> Childcare</label>
            <label><input type="checkbox" name="requiredSkills" value="Carpentry" /> Carpentry</label>
            <label><input type="checkbox" name="requiredSkills" value="Plumbing" /> Plumbing</label>
            <label><input type="checkbox" name="requiredSkills" value="Gardening" /> Gardening</label>
            <label><input type="checkbox" name="requiredSkills" value="Event Planning" /> Event Planning</label>
          </div>
          <select name="urgency" required>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button type="submit">Add Event</button>
        </form>
      </div>
    );
    setModalVisible(true);
  };

  const handleFormSubmit = (e, day) => {
    e.preventDefault();
    const form = e.target;
    const newEvent = {
      day,
      name: form.eventName.value,
      description: form.eventDescription.value,
      location: form.location.value,
      requiredSkills: Array.from(form.requiredSkills.querySelectorAll('input:checked')).map(checkbox => checkbox.value),
      urgency: form.urgency.value,
    };
    setEvents([...events, newEvent]);
    setModalVisible(false);
  };

  const showEventDetails = (event) => {
    setModalContent(
      <div>
        <span className="close" onClick={() => setModalVisible(false)}>&times;</span>
        <h2>Event Details</h2>
        <p><strong>Event Name:</strong> {event.name}</p>
        <p><strong>Event Description:</strong> {event.description}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Required Skills:</strong> {event.requiredSkills.join(', ')}</p>
        <p><strong>Urgency:</strong> {event.urgency}</p>
      </div>
    );
    setModalVisible(true);
  };

  return (
    <div className="calendar">
      <h2>{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</h2>
      <table>
        <thead>
          <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
          </tr>
        </thead>
        <tbody>
          {calendarTable}
        </tbody>
      </table>
      {modalVisible && <div className="modal">{modalContent}</div>}
    </div>
  );
};

export default EventCalendar;