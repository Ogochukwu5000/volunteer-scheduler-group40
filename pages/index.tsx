import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";
import client from "@/lib/mongodb";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

type ConnectionStatus = {
  isConnected: boolean;
};

const inter = Inter({ subsets: ["latin"] });

export const getServerSideProps: GetServerSideProps<
  ConnectionStatus
> = async () => {
  try {
    await client.connect(); // `await client.connect()` will use the default database passed in the MONGODB_URI
    return {
      props: { isConnected: true },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
};

export default function Home({
  isConnected,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="flex flex-col items-center justify-center space-y-6">
          <Link href="/login/user">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Login as User
            </button>
          </Link>
          <Link href="/login/admin">
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Login as Admin
            </button>
          </Link>
          <Link href="/register">
            <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
              Register
            </button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col place-items-center gap-12">
        <div className="relative
                        flex 
                        place-items-center 
                        gap-6 
                        before:absolute 
                        before:h-[300px] 
                        before:w-[480px] 
                        before:-translate-x-1/2 
                        before:rounded-full 
                        before:bg-gradient-radial 
                        before:from-white 
                        before:to-transparent 
                        before:blur-2xl 
                        before:content-[''] 
                        after:absolute 
                        after:-z-20 after:h-[180px] 
                        after:w-[240px] 
                        after:translate-x-1/3 
                        after:bg-gradient-conic 
                        after:from-sky-200 
                        after:via-blue-200 
                        after:blur-2xl 
                        after:content-[''] 
                        before:dark:bg-gradient-to-br 
                        before:dark:from-transparent 
                        before:dark:to-blue-700 
                        before:dark:opacity-10 
                        after:dark:from-sky-900 
                        after:dark:via-[#0141ff] 
                        after:dark:opacity-40 
                        before:lg:h-[360px] z-[-1]">
          <Image

            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
            src="/volunteers-3874924_1920.png"
            alt="Volunteer Logo"
            width={180}
            height={37}
            priority
          />
          
        </div>
        {isConnected ? (
          <h2 className="text-lg text-green-500">
            Welcome to Group 40's Volunteer Scheduler App!
          </h2>
        ) : (
          <h2 className="text-lg text-red-500">
            You are NOT connected to MongoDB. Check the <code>README.md</code>{" "}
            for instructions.
          </h2>
        )}
      </div>
    </main>
  );
}