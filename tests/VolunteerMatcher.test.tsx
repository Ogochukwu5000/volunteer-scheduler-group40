import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import VolunteerMatcher from './VolunteerMatcher';

const mockUser = {
  email: 'user@example.com',
};

const mockProfile = {
  skills: ['JavaScript', 'React', 'Node.js'],
};

test('renders user email', () => {
  render(<VolunteerMatcher user={mockUser} profile={mockProfile} />);

  const emailElement = screen.getByText(mockUser.email);
  expect(emailElement).toBeInTheDocument();
});

test('renders user skills', () => {
  render(<VolunteerMatcher user={mockUser} profile={mockProfile} />);

  mockProfile.skills.forEach((skill) => {
    const skillElement = screen.getByText(skill);
    expect(skillElement).toBeInTheDocument();
    expect(skillElement).toHaveClass('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800');
  });
});