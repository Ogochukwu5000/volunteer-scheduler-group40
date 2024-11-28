<<<<<<< HEAD
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EventsList from '../components/events/eventsList';

const mockEvents = [
  {
    id: 1,
    volunteers: [{ fullName: 'John Doe' }, { fullName: 'Jane Smith' }],
  },
  {
    id: 2,
    volunteers: [],
  },
];

test('renders list of volunteers', () => {
  render(<EventsList events={mockEvents} />);

  const volunteer1 = screen.getByText('Volunteer: John Doe');
  const volunteer2 = screen.getByText('Volunteer: Jane Smith');
  expect(volunteer1).toBeInTheDocument();
  expect(volunteer2).toBeInTheDocument();
});

test('renders no volunteers message', () => {
  render(<EventsList events={mockEvents} />);

  const noVolunteersMessage = screen.getByText('No volunteers matched for this event.');
  expect(noVolunteersMessage).toBeInTheDocument();
=======
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EventsList from './eventsList';

const mockEvents = [
  {
    id: 1,
    volunteers: [{ fullName: 'John Doe' }, { fullName: 'Jane Smith' }],
  },
  {
    id: 2,
    volunteers: [],
  },
];

test('renders list of volunteers', () => {
  render(<EventsList events={mockEvents} />);

  const volunteer1 = screen.getByText('Volunteer: John Doe');
  const volunteer2 = screen.getByText('Volunteer: Jane Smith');
  expect(volunteer1).toBeInTheDocument();
  expect(volunteer2).toBeInTheDocument();
});

test('renders no volunteers message', () => {
  render(<EventsList events={mockEvents} />);

  const noVolunteersMessage = screen.getByText('No volunteers matched for this event.');
  expect(noVolunteersMessage).toBeInTheDocument();
>>>>>>> d18a511abbaed977b501d86fb32f98e1d0acdd6f
});