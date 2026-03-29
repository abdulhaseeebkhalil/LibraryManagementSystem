import { useState } from "react";

const AdminLogin = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return alert(data.message);
      }

      // Check if user has admin privileges if needed, currently proceeding normally
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/admin/dashboard";
    } catch (error) {
      alert("System error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Admin Themed Card: Darker, Ruby accents */}
        <div className="bg-gray-900/90 backdrop-blur-2xl border border-gray-700 p-10 rounded-[2rem] shadow-2xl relative overflow-hidden">
          
          {/* Decorative glowing orb */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-500 rounded-full mix-blend-screen filter blur-[60px] opacity-40 pointer-events-none"></div>

          <div className="text-center mb-10 relative z-10">
            <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-rose-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-rose-500/30 transform -rotate-6">
              <span className="text-3xl filter drop-shadow-md">👑</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">
              Admin Portal
            </h2>
            <p className="text-sm text-gray-400 font-medium">
              Restricted access. Authorized personnel only.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5 ml-1">
                Admin Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="admin@library.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5 ml-1">
                Security Passkey
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-rose-600 to-orange-500 text-white font-bold py-4 rounded-2xl hover:shadow-[0_8px_25px_rgb(244,63,94,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center group"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="flex items-center gap-2">
                  Initialize Access 
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                </span>
              )}
            </button>
          </form>
        </div>

        {/* User Login redirect */}
        <div className="mt-6 text-center">
            <a href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              ← Return to standard user login
            </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
