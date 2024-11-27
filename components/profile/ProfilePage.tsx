import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IUserProfile } from '@/lib/models/userProfile.model';
import { IEventVolunteer } from '@/lib/models/eventVolunteer.model';
import { BellIcon, PencilIcon } from '@heroicons/react/solid';

const UserProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [participationHistory, setParticipationHistory] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserSession = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log("token,", token)
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/auth/session', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log("data", data)
        
        if (!data) {
          res.json("user not found");
          return;
        }
        
        setUser(data);
        console.log("data2", data)
      } catch (err) {
        setError('Failed to fetch user session');
        console.error(err);
      }
    };

    fetchUserSession();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?._id) {
        console.log("No user ID found");
        return;
      }

      try {
        const profileRes = await fetch(`/api/userProfiles?ids=${user._id}`);
        const profileData = await profileRes.json();
        
        if (!profileData?.length) {
          setError("No profile found");
          return;
        }
        
        setUserProfile(profileData[0]);

        const historyRes = await fetch(`/api/volunteerHistory?userId=${user._id}`);
        const historyData = await historyRes.json();
        setParticipationHistory(historyData);

        const notifRes = await fetch(`/api/notifications/unread?userId=${user._id}`);
        const notifData = await notifRes.json();
        setHasUnreadNotifications(notifData.hasUnread);

      } catch (err) {
        console.error("Fetch error:", err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user data');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUserData();
  }, [user?._id]);



  const handleEditProfile = () => router.push('/profile/edit');
  const handleViewNotifications = () => router.push('/notifications');

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  if (!userProfile) {
    return <div className="p-4">No profile data available</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">User Profile</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleViewNotifications}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <BellIcon className={`h-6 w-6 ${hasUnreadNotifications ? 'text-red-500' : 'text-gray-500'}`} />
          </button>
          <button 
            onClick={handleEditProfile}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <PencilIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </header>

      <div className="bg-white rounded-lg shadow p-6 mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="font-medium">{user?.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Full Name</label>
            <p className="font-medium">{userProfile.fullName}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-500">Address</label>
            <p className="font-medium">
              {userProfile.address1}
              {userProfile.address2 && `, ${userProfile.address2}`}
              {`, ${userProfile.city}, ${userProfile.state} ${userProfile.zipCode}`}
            </p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-500">Skills</label>
            <p className="font-medium">{userProfile.skills?.join(', ') || 'None listed'}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-500">Preferences</label>
            <p className="font-medium">{userProfile.preferences || 'None listed'}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-500">Availability</label>
            <p className="font-medium">
              {userProfile.availability?.map(date => 
                new Date(date).toLocaleDateString()
              ).join(', ') || 'None listed'}
            </p>
          </div>
        </div>
      </div>

      {participationHistory.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-4">Participation History</h2>
          <div className="space-y-4">
            {participationHistory.map((event) => (
              <div 
                key={event.eventId} 
                className="bg-white rounded-lg shadow p-4"
              >
                <p className="font-medium">{event.eventName}</p>
                <p className="text-sm text-gray-500">
                  {new Date(event.eventDate).toLocaleDateString()} • {event.eventLocation}
                </p>
                <p className="text-sm text-gray-500">Role: {event.role}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserProfilePage;