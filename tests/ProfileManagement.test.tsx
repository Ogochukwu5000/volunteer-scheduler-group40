import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, screen } from '@testing-library/react';
import EditProfilePage from '../components/profile/ProfileManagement';

test('renders Save Changes button', () => {
  render(<EditProfilePage />);
  const saveButton = screen.getByText(/Save Changes/i);
  expect(saveButton).toBeInTheDocument();
});