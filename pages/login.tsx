import LoginForm from '@/components/auth/loginForm';
import type { NextPage } from 'next';
import Head from 'next/head';

const LoginPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Login  -  App</title>
        <meta name="description" content="Create a new account" />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <LoginForm />
        </div>
      </main>
    </>
  );
};

export default LoginPage;