import type { NextPage } from 'next';
import Head from 'next/head';
import RegisterForm from '../components/auth/RegisterForm';
import ProfilePage from '@/components/profile/ProfilePage';

const RegisterPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Register - Your App Name</title>
        <meta name="description" content="Create a new account" />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <ProfilePage />
        </div>
      </main>
    </>
  );
};

export default RegisterPage;