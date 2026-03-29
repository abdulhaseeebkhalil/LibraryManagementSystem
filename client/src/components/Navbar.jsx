import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/api/v1/auth/logout", {
        method: "GET",
        credentials: "include",
      });

      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      alert("Logout failed");
    }
  };

  const isAuthPage = location.pathname === "/" || location.pathname === "/verify-otp";
  const isAdminLogin = location.pathname === "/admin/login";
  const isAdminDashboard = location.pathname === "/admin/dashboard";

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center cursor-pointer gap-2"
            onClick={() => navigate(isAdminLogin || isAdminDashboard ? "/admin/dashboard" : (isAuthPage ? "/" : "/dashboard"))}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-md ${isAdminLogin || isAdminDashboard ? "bg-gradient-to-tr from-rose-500 to-orange-500" : "bg-gradient-to-tr from-indigo-600 to-purple-600"}`}>
              L
            </div>
            <h1 className={`text-xl font-bold bg-clip-text text-transparent tracking-tight hidden sm:block ${isAdminLogin || isAdminDashboard ? "bg-gradient-to-r from-rose-500 to-orange-500" : "bg-gradient-to-r from-indigo-600 to-purple-600"}`}>
              {isAdminLogin || isAdminDashboard ? "LibraryAdmin" : "LibraryHub"}
            </h1>
          </div>

          {/* Right Side */}
          {(!isAuthPage && !isAdminLogin) && (
            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate(isAdminDashboard ? "/admin/dashboard" : "/dashboard")}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === "/dashboard" || location.pathname === "/admin/dashboard"
                    ? (isAdminDashboard ? "text-rose-600" : "text-indigo-600") 
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                Dashboard
              </button>

              <button
                onClick={handleLogout}
                className="group relative inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-white transition-all duration-200 bg-gray-900 border border-transparent rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;