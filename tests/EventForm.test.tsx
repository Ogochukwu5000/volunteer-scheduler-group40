import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EventForm from '../components/events/EventForm';

test('renders Event Description textarea', () => {
  const mockSetFormData = jest.fn();
  const mockFormData = { description: '' };
  const mockIsLoading = false;

  render(
    <EventForm
      formData={mockFormData}
      setFormData={mockSetFormData}
      isLoading={mockIsLoading}
    />
  );

  const descriptionTextarea = screen.getByLabelText(/Event Description/i);
  expect(descriptionTextarea).toBeInTheDocument();
  expect(descriptionTextarea).toHaveAttribute('required');
  expect(descriptionTextarea).not.toBeDisabled();
});

test('updates Event Description value on change', () => {
  const mockSetFormData = jest.fn();
  const mockFormData = { description: '' };
  const mockIsLoading = false;

  render(
    <EventForm
      formData={mockFormData}
      setFormData={mockSetFormData}
      isLoading={mockIsLoading}
    />
  );

  const descriptionTextarea = screen.getByLabelText(/Event Description/i);
  fireEvent.change(descriptionTextarea, { target: { value: 'New event description' } });

  expect(mockSetFormData).toHaveBeenCalledWith({ ...mockFormData, description: 'New event description' });
});