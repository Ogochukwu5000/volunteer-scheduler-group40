// components/profile/ProfileManagement.tsx
'use client';

import React, { useState, useEffect } from 'react';

// Using the same constants from RegisterForm
const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  // ... (rest of states)
] as const;

const AVAILABLE_SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "MongoDB",
  "HTML/CSS",
] as const;

const ProfileManagement = () => {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    skills: [] as string[],
    preferences: '',
    availability: [] as string[],
  });

  // Fetch user profile data on component mount
  useEffect(() => {
    setMounted(true);
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you store the JWT token in localStorage
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch profile');
      
      const userData = await response.json();
      setFormData({
        fullName: userData.profile.fullName,
        address1: userData.profile.address1,
        address2: userData.profile.address2 || '',
        city: userData.profile.city,
        state: userData.profile.state,
        zipCode: userData.profile.zipCode,
        skills: userData.profile.skills,
        preferences: userData.profile.preferences || '',
        availability: userData.profile.availability.map((date: Date) => 
          new Date(date).toISOString().split('T')[0]
        ),
      });
    } catch (err) {
      setError('Failed to load profile data');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const res = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Update failed');
      }
      
      setSuccessMessage('Profile updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (date: string) => {
    if (!formData.availability.includes(date)) {
      setFormData({
        ...formData,
        availability: [...formData.availability, date].sort(),
      });
    }
  };

  const removeDate = (dateToRemove: string) => {
    setFormData({
      ...formData,
      availability: formData.availability.filter(date => date !== dateToRemove),
    });
  };

  if (!mounted) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-900">Profile Management</h2>

      {/* Personal Information */}
      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name * (max 50 characters)
          </label>
          <input
            type="text"
            id="fullName"
            maxLength={50}
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="address1" className="block text-sm font-medium text-gray-700">
            Address 1 * (max 100 characters)
          </label>
          <input
            type="text"
            id="address1"
            maxLength={100}
            value={formData.address1}
            onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="address2" className="block text-sm font-medium text-gray-700">
            Address 2 (max 100 characters)
          </label>
          <input
            type="text"
            id="address2"
            maxLength={100}
            value={formData.address2}
            onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City * (max 100 characters)
            </label>
            <input
              type="text"
              id="city"
              maxLength={100}
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">
              State *
            </label>
            <select
              id="state"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              disabled={isLoading}
            >
              <option value="">Select a state</option>
              {US_STATES.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
              Zip Code * (5-9 characters)
            </label>
            <input
              type="text"
              id="zipCode"
              maxLength={9}
              minLength={5}
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
            Skills * (Select multiple)
          </label>
          <select
            id="skills"
            multiple
            value={formData.skills}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, (option) => option.value);
              setFormData({ ...formData, skills: selected });
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
            disabled={isLoading}
          >
            {AVAILABLE_SKILLS.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="preferences" className="block text-sm font-medium text-gray-700">
            Preferences
          </label>
          <textarea
            id="preferences"
            value={formData.preferences}
            onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
            Availability *
          </label>
          <input
            type="date"
            id="availability"
            onChange={(e) => handleDateSelect(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            disabled={isLoading}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.availability.map((date) => (
              <span
                key={date}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {date}
                <button
                  type="button"
                  onClick={() => removeDate(date)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                  disabled={isLoading}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="text-green-600 text-sm">
          {successMessage}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default ProfileManagement;