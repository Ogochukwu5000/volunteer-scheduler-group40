import React, { useState, useEffect } from 'react';
import './EventCalendar.css';

const EventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [events, setEvents] = useState([]);
  const [calendarTable, setCalendarTable] = useState([]);

  useEffect(() => {
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    setCalendar({ daysInMonth, firstDay });
  }, [currentDate]);

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
    <form onSubmit={(e) => handleFormSubmit(e, day)}>
      <span className="close" onClick={() => setModalVisible(false)}>&times;</span>
      <div>
        <label htmlFor="eventName">Event Name:</label>
      </div>
      <input type="text" id="eventName" name="eventName" maxLength="100" required />
      <div>
        <label htmlFor="eventDescription">Event Description:</label>
      </div>
      <textarea id="eventDescription" name="eventDescription" className="fixed-size" required></textarea>
      <div>
        <label htmlFor="location">Location:</label>
      </div>
      <textarea id="location" name="location" className="fixed-size" required></textarea>
      <div>
        <label htmlFor="requiredSkills">Required Skills:</label>
      </div>
      <div id="requiredSkills" className="checkbox-columns">
        {/* Add your checkboxes here */}
      </div>
      <label htmlFor="urgency">Urgency:</label>
      <select id="urgency" name="urgency" required>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <button type="submit">Create Event</button>
    </form>
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