<<<<<<< HEAD
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RegisterPage from './../pages/register';
import RegisterForm from '../components/auth/RegisterForm';

jest.mock('../components/auth/RegisterForm', () => () => <div>Mocked RegisterForm</div>);

test('renders RegisterForm component', () => {
  render(<RegisterPage />);
  const registerForm = screen.getByText('Mocked RegisterForm');
  expect(registerForm).toBeInTheDocument();
=======
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RegisterPage from './register';
import RegisterForm from '../components/auth/RegisterForm';

jest.mock('../components/auth/RegisterForm', () => () => <div>Mocked RegisterForm</div>);

test('renders RegisterForm component', () => {
  render(<RegisterPage />);
  const registerForm = screen.getByText('Mocked RegisterForm');
  expect(registerForm).toBeInTheDocument();
>>>>>>> d18a511abbaed977b501d86fb32f98e1d0acdd6f
});