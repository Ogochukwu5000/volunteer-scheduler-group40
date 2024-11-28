<<<<<<< HEAD
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../pages/login';

test('renders login form elements', () => {
  const mockSetFormData = jest.fn();
  const mockFormData = { password: '' };
  const mockIsLoading = false;
  const mockError = '';

  render(
    <LoginForm
      formData={mockFormData}
      setFormData={mockSetFormData}
      isLoading={mockIsLoading}
      error={mockError}
    />
  );

  const passwordInput = screen.getByLabelText(/password/i);
  const forgotPasswordLink = screen.getByText(/forgot-password/i);

  expect(passwordInput).toBeInTheDocument();
  expect(passwordInput).toHaveAttribute('required');
  expect(passwordInput).not.toBeDisabled();
  expect(forgotPasswordLink).toBeInTheDocument();
});

test('updates password value on change', () => {
  const mockSetFormData = jest.fn();
  const mockFormData = { password: '' };
  const mockIsLoading = false;
  const mockError = '';

  render(
    <LoginForm
      formData={mockFormData}
      setFormData={mockSetFormData}
      isLoading={mockIsLoading}
      error={mockError}
    />
  );

  const passwordInput = screen.getByLabelText(/password/i);
  fireEvent.change(passwordInput, { target: { value: 'newpassword' } });

  expect(mockSetFormData).toHaveBeenCalledWith({ ...mockFormData, password: 'newpassword' });
});

test('displays error message', () => {
  const mockSetFormData = jest.fn();
  const mockFormData = { password: '' };
  const mockIsLoading = false;
  const mockError = 'Invalid credentials';

  render(
    <LoginForm
      formData={mockFormData}
      setFormData={mockSetFormData}
      isLoading={mockIsLoading}
      error={mockError}
    />
  );

  const errorMessage = screen.getByText(/invalid credentials/i);
  expect(errorMessage).toBeInTheDocument();
=======
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoginForm from './loginForm';

test('renders login form elements', () => {
  const mockSetFormData = jest.fn();
  const mockFormData = { password: '' };
  const mockIsLoading = false;
  const mockError = '';

  render(
    <LoginForm
      formData={mockFormData}
      setFormData={mockSetFormData}
      isLoading={mockIsLoading}
      error={mockError}
    />
  );

  const passwordInput = screen.getByLabelText(/password/i);
  const forgotPasswordLink = screen.getByText(/forgot-password/i);

  expect(passwordInput).toBeInTheDocument();
  expect(passwordInput).toHaveAttribute('required');
  expect(passwordInput).not.toBeDisabled();
  expect(forgotPasswordLink).toBeInTheDocument();
});

test('updates password value on change', () => {
  const mockSetFormData = jest.fn();
  const mockFormData = { password: '' };
  const mockIsLoading = false;
  const mockError = '';

  render(
    <LoginForm
      formData={mockFormData}
      setFormData={mockSetFormData}
      isLoading={mockIsLoading}
      error={mockError}
    />
  );

  const passwordInput = screen.getByLabelText(/password/i);
  fireEvent.change(passwordInput, { target: { value: 'newpassword' } });

  expect(mockSetFormData).toHaveBeenCalledWith({ ...mockFormData, password: 'newpassword' });
});

test('displays error message', () => {
  const mockSetFormData = jest.fn();
  const mockFormData = { password: '' };
  const mockIsLoading = false;
  const mockError = 'Invalid credentials';

  render(
    <LoginForm
      formData={mockFormData}
      setFormData={mockSetFormData}
      isLoading={mockIsLoading}
      error={mockError}
    />
  );

  const errorMessage = screen.getByText(/invalid credentials/i);
  expect(errorMessage).toBeInTheDocument();
>>>>>>> d18a511abbaed977b501d86fb32f98e1d0acdd6f
});