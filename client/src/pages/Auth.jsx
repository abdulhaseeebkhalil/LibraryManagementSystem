import { useState } from "react";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Handle input change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Handle submit (API call)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const base = import.meta.env.VITE_API_URL;
      const url = isLogin
        ? `${base}/api/v1/auth/login`
        : `${base}/api/v1/auth/register`;

      const res = await fetch(url, {
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

      if (!isLogin) {
        // Registration success, navigate to verify OTP with email in state
        window.location.href = `/verify-otp?email=${encodeURIComponent(form.email)}`;
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/dashboard";
    } catch (error) {
      alert("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12">
      <div className="w-full max-w-md animate-fade-in-up">
        <div className="bg-white/70 backdrop-blur-2xl border border-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
              {isLogin ? "Welcome back" : "Create Account"}
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              {isLogin 
                ? "Enter your details to access your account." 
                : "Join the largest library network today."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name (only register) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1 cursor-pointer">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required={!isLogin}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1 cursor-pointer">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 ml-1 cursor-pointer">
                Password
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 rounded-2xl hover:shadow-[0_8px_25px_rgb(99,102,241,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-8 text-center pt-6 border-t border-gray-100">
            <p className="text-sm font-medium text-gray-500 mb-4">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setForm({ name: "", email: "", password: "" }); // reset form
                }}
                className="text-indigo-600 hover:text-purple-600 ml-2 font-bold transition-colors focus:outline-none"
              >
                {isLogin ? "Register now" : "Sign in here"}
              </button>
            </p>
            
            {/* Added Admin Link */}
            <a 
              href="/admin/login" 
              className="inline-flex items-center gap-2 text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-full"
            >
              <span>🛡️</span> Admin Portal Access
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;