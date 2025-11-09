import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineHotel } from "react-icons/md";

const StudentLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // Select user directly to avoid creating new references in the selector
  const reduxUser = useSelector((state) => (state && state.auth ? state.auth.user : null));
  // fallback to persisted user stored at login for immediate UI hydration
  let user = reduxUser;
  if (!user) {
    try {
      const raw = localStorage.getItem('userData');
      if (raw) user = JSON.parse(raw);
    } catch (e) {
      user = reduxUser;
    }
  }

  const logoutHandler = () => {
    // this app stores the auth token as `userToken` (legacy `token` sometimes used elsewhere)
    localStorage.removeItem("userToken");
    localStorage.removeItem("token");
    localStorage.removeItem('userData');
    localStorage.removeItem("userType");
    navigate("/login");
  };

  const links = [
    { 
      path: "/student", 
      label: "Dashboard", 
      icon: <IoHomeOutline className="w-5 h-5" /> 
    },
  ];

  // Only show hostel link if student has hostel access
  const localType = (typeof localStorage !== 'undefined' && localStorage.getItem('userType')) || null;
  const isStudent = localType === 'Student' || !!user;
  // debug: log user/localType for layout decisions
  try {
    if (import.meta?.env?.DEV || (typeof localStorage !== 'undefined' && localStorage.getItem('AXIOS_DEBUG') === '1')) {
      // eslint-disable-next-line no-console
      console.debug('[StudentLayout] user:', user, 'localType:', localType, 'hostelStudentId:', user?.hostelStudentId);
    }
  } catch (e) {}
  // Show Hostel link for students. If student hasn't got a hostelStudentId yet,
  // the Hostel page can handle absence (or redirect). Showing the link improves
  // discoverability during local testing.
  if (isStudent) {
    links.push({
      path: "/student/hostel",
      label: "Hostel",
      icon: <MdOutlineHotel className="w-5 h-5" />
    });
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              {/* Logo/Brand */}
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-blue-600">CMS</h1>
              </div>

              {/* Nav Links */}
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {links.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 ${
                      location.pathname === link.path
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {link.icon}
                    <span className="ml-2">{link.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right side */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <Link
                    to="/profile"
                    className="text-sm font-medium text-gray-700 hover:text-gray-800"
                  >
                    {user?.firstName} {user?.lastName}
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className="ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <FiLogOut className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
};

export default StudentLayout;
