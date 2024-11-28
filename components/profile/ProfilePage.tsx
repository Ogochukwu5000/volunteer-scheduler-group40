import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { BellIcon, PencilIcon } from '@heroicons/react/24/solid';
import { IUserProfile } from '@/lib/models/userProfile.model';
import { IEventVolunteer } from '@/lib/models/eventVolunteer.model';

interface User {
  _id: string;
  email: string;
}

interface ParticipationEvent {
  eventId: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  role: string;
}

const UserProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
  const [participationHistory, setParticipationHistory] = useState<ParticipationEvent[]>([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }
    //   alert(token)
      try {
        const response = await fetch('/api/auth/session', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Authentication failed');
        
        const data = await response.json();
        if (!data?.user?._id) throw new Error('Invalid user data');
        
        setUser(data.user);
      } catch (err) {
        setError('Authentication failed');
        router.push('/login');
      }
    };
    

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

      try {
        const [profileRes] = await Promise.all([
          fetch(`/api/userProfiles`, {
          headers: { Authorization: `Bearer ${token}` }
          })
        //   fetch(`/api/volunteerHistory?userId=${user._id}`),
        //   fetch(`/api/notifications/unread?userId=${user._id}`)
        ]);

        if (!profileRes.ok) throw new Error('Failed to fetch profile');
        const profileData = await profileRes.json();
        setUserProfile(profileData);

        // if (!historyRes.ok) throw new Error('Failed to fetch history');
        // const historyData = await historyRes.json();
        // setParticipationHistory(historyData);

        // if (!notifRes.ok) throw new Error('Failed to fetch notifications');
        // const notifData = await notifRes.json();
        // setHasUnreadNotifications(notifData.hasUnread);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user?._id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">No profile data available</p>
      </div>
    );
  }

  const ProfileHeader = () => (
    <header className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-bold">User Profile</h1>
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => router.push('/notifications')}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <BellIcon 
            className={`h-6 w-6 ${hasUnreadNotifications ? 'text-red-500' : 'text-gray-500'}`} 
          />
        </button>
        <button 
          onClick={() => router.push('/profileUpdate')}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <PencilIcon className="h-6 w-6 text-gray-500" />
        </button>
      </div>
    </header>
  );

  const ProfileField = ({ label, value }: { label: string; value: string | string[] }) => (
    <div className="md:col-span-2">
      <label className="text-sm text-gray-500">{label}</label>
      <p className="font-medium">
        {Array.isArray(value) ? value.join(', ') : value || 'None listed'}
      </p>
    </div>
  );

  const ParticipationHistorySection = () => (
    participationHistory.length > 0 && (
      <section>
        <h2 className="text-xl font-bold mb-4">Participation History</h2>
        <div className="space-y-4">
          {participationHistory.map((event) => (
            <div 
              key={event.eventId} 
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
            >
              <p className="font-medium">{event.eventName}</p>
              <p className="text-sm text-gray-500">
                {new Date(event.eventDate).toLocaleDateString()} • {event.eventLocation}
              </p>
              <p className="text-sm text-gray-500">Role: {event.role}</p>
            </div>
          ))}
        </div>
      </section>
    )
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <ProfileHeader />

      <div className="bg-white rounded-lg shadow p-6 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileField label="Email" value={user?.email || ''} />
          <ProfileField label="Full Name" value={userProfile.fullName} />
          <ProfileField 
            label="Address" 
            value={`${userProfile.address1}${userProfile.address2 ? `, ${userProfile.address2}` : ''}, ${userProfile.city}, ${userProfile.state} ${userProfile.zipCode}`}
          />
          <ProfileField label="Skills" value={userProfile.skills || []} />
          <ProfileField label="Preferences" value={userProfile.preferences || ''} />
          <ProfileField 
            label="Availability" 
            value={userProfile.availability?.map(date => new Date(date).toLocaleDateString()) || []}
          />
        </div>
      </div>

      <ParticipationHistorySection />
    </div>
  );
};

export default UserProfilePage;