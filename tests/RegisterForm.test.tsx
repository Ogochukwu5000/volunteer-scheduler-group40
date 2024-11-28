import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RegisterForm from './RegisterForm';

test('renders registration form elements', () => {
  render(<RegisterForm />);

  const usernameInput = screen.getByLabelText(/Username/i);
  const emailInput = screen.getByLabelText(/Email/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const submitButton = screen.getByRole('button', { name: /Register/i });

  expect(usernameInput).toBeInTheDocument();
  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(submitButton).toBeInTheDocument();
});

test('submits the form', () => {
  const mockSubmit = jest.fn();
  render(<RegisterForm onSubmit={mockSubmit} />);

  const usernameInput = screen.getByLabelText(/Username/i);
  const emailInput = screen.getByLabelText(/Email/i);
  const passwordInput = screen.getByLabelText(/Password/i);
  const submitButton = screen.getByRole('button', { name: /Register/i });

  fireEvent.change(usernameInput, { target: { value: 'testuser' } });
  fireEvent.change(emailInput, { target: { value: 'testuser@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.click(submitButton);

  expect(mockSubmit).toHaveBeenCalled();
});