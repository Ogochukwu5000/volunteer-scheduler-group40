'use client';

import React, { useState, useEffect } from 'react';
import { IUser } from '@/lib/models/users.model';
import { IUserProfile } from '@/lib/models/userProfile.model';
import { IEvent } from '@/lib/models/event.model';

const VolunteerMatcher = () => {
  const [volunteers, setVolunteers] = useState<{ user: IUser; profile: IUserProfile }[]>([]);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [volunteersRes, eventsRes] = await Promise.all([
          fetch('/api/users?role=volunteer'),
          fetch('/api/events'),
        ]);
    
        if (!volunteersRes.ok) {
          throw new Error('Failed to fetch volunteers');
        }
    
        if (!eventsRes.ok) {
          throw new Error('Failed to fetch events');
        }
    
        const volunteersData = await volunteersRes.json();
        const eventsData = await eventsRes.json();
    
        // Fetch the user profiles in a single request
        const userIds = volunteersData.users.map((user: IUser) => user._id);
        const profilesRes = await fetch(`/api/userProfiles?ids=${userIds.join(',')}`);
    
        if (!profilesRes.ok) {
          throw new Error('Failed to fetch user profiles');
        }
    
        const profiles = await profilesRes.json();
    
        // Combine the user and profile data
        const volunteersWithProfiles = volunteersData.users.map((user: IUser) => ({
          user,
          profile: profiles.find((p: IUserProfile) => p._id === user._id),
        }));
    
        setVolunteers(volunteersWithProfiles);
        setEvents(eventsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      }
    };

    fetchData();
  }, []);

  const handleMatch = async (volunteerId: string) => {
    const eventId = selectedEvent[volunteerId];
    if (!eventId) {
      setError('Please select an event to match.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/events/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteerId, eventId }),
      });

      if (!res.ok) {
        throw new Error('Failed to match volunteer');
      }

      // Refresh events list
      const updatedEvents = await fetch('/api/events').then((res) => res.json());
      setEvents(updatedEvents);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to match volunteer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-900">Volunteer Matcher</h2>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Volunteer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Skills
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Suggested Events
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
          {volunteers.map(({ user, profile }) => {
            // Find matching events based on skills
            const matchingEvents = events.filter((event) =>
              event.requiredSkills.some((skill) =>
                profile?.skills.includes(skill),
              ) && !event.volunteers?.includes(user._id!)
            );

              return (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {profile?.fullName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {profile?.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {matchingEvents.length === 0 ? (
                      <span className="text-sm text-gray-500">No matching events</span>
                    ) : (
                      <select
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        value={selectedEvent[user._id!] || ''}
                        onChange={(e) =>
                          setSelectedEvent((prev) => ({
                            ...prev,
                            [user._id!]: e.target.value,
                          }))
                        }
                      >
                        <option value="" disabled>Select an event</option>
                        {matchingEvents.map((event) => (
                          <option key={event._id} value={event._id}>
                            {event.name} ({new Date(event.eventDate).toLocaleDateString()})
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleMatch(user._id!)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      disabled={isLoading || matchingEvents.length === 0}
                    >
                      Match
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VolunteerMatcher;