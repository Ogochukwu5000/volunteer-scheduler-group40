// components/EventsList.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { IEvent } from '@/lib/models/event.model';
import { IUserProfile } from '@/lib/models/userProfile.model';

const EventsList = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null); // Track expanded event

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetch('/api/events');
        if (!res.ok) {
          throw new Error('Failed to fetch events');
        }

        const data = await res.json();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const toggleDropdown = (eventId: string) => {
    setExpandedEvent((prev) => (prev === eventId ? null : eventId));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-900">Events</h2>

      {error && <div className="text-red-600">{error}</div>}

      {isLoading ? (
        <div>Loading events...</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                City
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volunteers</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <React.Fragment key={event._id?.toString()}>
                <tr>
                  <td className="px-6 py-4">{event.name}</td>
                  <td className="px-6 py-4">{event.city}</td>
                  <td className="px-6 py-4">{event.state}</td>
                  <td className="px-6 py-4">{new Date(event.eventDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleDropdown(event._id!.toString())}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 focus:outline-none"
                    >
                      {expandedEvent === event._id?.toString() ? 'Hide' : 'View'} Volunteers
                    </button>
                  </td>
                </tr>
                {expandedEvent === event._id?.toString() && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 bg-gray-100">
                      {event.volunteers && event.volunteers.length > 0 ? (
                        <ul className="list-disc pl-4">
                          {event.volunteers.map((volunteer) => (
                            <li key={volunteer.fullName} className="text-sm text-gray-800">
                              Volunteer: {volunteer.fullName}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No volunteers matched for this event.</p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EventsList;