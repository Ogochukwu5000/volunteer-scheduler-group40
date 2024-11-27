// components/UserProfilePage.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { IUserProfile } from '@/lib/models/userProfile.model';
import { IEventVolunteer } from '@/lib/models/eventVolunteer.model';
import { IEvent} from '@/lib/models/event.model';
import { BellIcon, PencilIcon } from '@heroicons/react/solid';

const UserProfilePage = () => {
  const router = useRouter();
  const { user, authToken } = useAuth();
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
  const [participationHistory, setParticipationHistory] = useState<IEventVolunteer[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      setError('');

      try {
        // Fetch user profile
        const profileRes = await fetch(`/api/users/profile`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (!profileRes.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const profileData = await profileRes.json();
        setUserProfile(profileData);

        // Fetch participation history
        const historyRes = await fetch(`/api/users/participation-history`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (!historyRes.ok) {
          throw new Error('Failed to fetch participation history');
        }

        const historyData = await historyRes.json();
        setParticipationHistory(historyData);

        // Check for unread notifications
        const notificationsRes = await fetch(`/api/users/notifications`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (!notificationsRes.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const notificationsData = await notificationsRes.json();
        setHasUnreadNotifications(notificationsData.hasUnreadNotifications);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [authToken]);

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleViewNotifications = () => {
    router.push('/notifications');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userProfile) {
    return null;
  }

  return (
    <div>
      <header className="flex items-center justify-between">
        <h1>User Profile</h1>
        <div className="flex items-center space-x-4">
          <button onClick={handleViewNotifications}>
            <BellIcon className={`h-6 w-6 ${hasUnreadNotifications ? 'text-red-500' : 'text-gray-500'}`} />
          </button>
          <button onClick={handleEditProfile}>
            <PencilIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </header>
      <div>
        <p>Email: {user.email}</p>
        <p>Full Name: {userProfile.fullName}</p>
        <p>Address: {userProfile.address1}, {userProfile.address2}, {userProfile.city}, {userProfile.state} {userProfile.zipCode}</p>
        <p>Skills: {userProfile.skills.join(', ')}</p>
        <p>Preferences: {userProfile.preferences}</p>
        <p>Availability: {userProfile.availability.map((date) => date.toLocaleDateString()).join(', ')}</p>
      </div>
      <h2>Participation History</h2>
      <ul>
        {participationHistory.map((event) => (
          <li key={event.eventId}>
            <p>Event: {event.eventName}</p>
            <p>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
            <p>Location: {event.eventLocation}</p>
            <p>Role: {event.role}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserProfilePage;