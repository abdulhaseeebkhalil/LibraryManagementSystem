import { useEffect, useState } from "react";
import { getUser } from "../api/auth";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUser();
        setUser(data.user);
      } catch (error) {
        console.error("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center pt-10">
      <div className="w-full max-w-4xl animate-fade-in-up">
        {/* Header Section */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-2">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl">
            Here's what's happening in your library today.
          </p>
        </div>

        {/* User Stats/Info Card */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : user ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="col-span-1 md:col-span-2 bg-white/60 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Profile Overview</h3>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 overflow-hidden shadow-inner flex items-center justify-center text-3xl text-white font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{user.name}</h4>
                  <p className="text-gray-500 font-medium">{user.email}</p>
                  <span className="inline-block mt-3 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-lg">
                    Active Member
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl shadow-lg relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-20 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 text-white text-8xl">
                📚
              </div>
              <div className="relative z-10 text-white">
                <h3 className="text-indigo-100 font-medium mb-1">Books Borrowed</h3>
                <p className="text-5xl font-black mb-4">0</p>
                <div className="w-full bg-white/20 h-1 rounded-full mb-2">
                  <div className="bg-white h-1 rounded-full w-0"></div>
                </div>
                <p className="text-sm font-medium text-indigo-100">0 out of 5 limit</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/60 backdrop-blur-xl border border-white p-12 rounded-3xl shadow-sm text-center">
            <p className="text-xl text-gray-600 font-medium mb-4">Unable to load user data</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}