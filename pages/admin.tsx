// pages/admin.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { 
  DocumentTextIcon, 
  DocumentDownloadIcon,
  UserGroupIcon,
  CalendarIcon 
} from '@heroicons/react/24/solid';
import { GrDocumentDownload } from "react-icons/gr";


const AdminPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    activeVolunteers: 0
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('/api/auth/session', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const data = await response.json();
        if (!data?.user?.role === 'admin') {
          router.push('/');
          return;
        }
      } catch (err) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleDownloadPDF = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reports/generatePdf', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to generate PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'volunteer-report.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to download PDF report');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reports/generateCsv', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Failed to generate CSV');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'volunteer-reports.zip';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to download CSV reports');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Events</p>
              <p className="text-2xl font-bold">{stats.totalEvents}</p>
            </div>
            <CalendarIcon className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Active Volunteers</p>
              <p className="text-2xl font-bold">{stats.activeVolunteers}</p>
            </div>
            <UserGroupIcon className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Generate Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleDownloadPDF}
              disabled={isLoading}
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              {isLoading ? 'Generating PDF...' : 'Download PDF Report'}
            </button>

            <button
              onClick={handleDownloadCSV}
              disabled={isLoading}
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              <DocumentDownloadIcon className="h-5 w-5 mr-2" />
              {isLoading ? 'Generating CSV...' : 'Download CSV Reports'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;