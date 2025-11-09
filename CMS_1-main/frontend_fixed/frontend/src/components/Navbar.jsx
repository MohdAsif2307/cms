import React from "react";
import { FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { CMS_BASE_URL } from "../baseUrl";
import { RxDashboard } from "react-icons/rx";
import CustomButton from "./CustomButton";
import toast from 'react-hot-toast';

const Navbar = () => {
  const router = useLocation();
  const navigate = useNavigate();
  // debug: log storage keys and user type for troubleshooting
  try {
    if (import.meta?.env?.DEV || localStorage.getItem('AXIOS_DEBUG') === '1') {
      // eslint-disable-next-line no-console
      console.debug('[Navbar] userType:', localStorage.getItem('userType'), 'userToken:', localStorage.getItem('userToken'), 'token:', localStorage.getItem('token'));
    }
  } catch (e) {}

  const logouthandler = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userType");
    // clear persisted userData as well
    localStorage.removeItem('userData');
    navigate("/login");
  };

  // prefer Redux user data (populated after login). Fall back to localStorage.userType
  const reduxUser = useSelector((state) => (state && state.auth ? state.auth.user : null));
  const userType = reduxUser?.role ? (String(reduxUser.role).charAt(0).toUpperCase() + String(reduxUser.role).slice(1)) : (localStorage.getItem("userType") || null);

  const openHostelSSO = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) return navigate('/login');
      const res = await fetch(`${CMS_BASE_URL.replace(/\/$/, '')}/sso/redirect`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const data = await res.json().catch(() => null);
      const redirectUrl = data && data.redirectUrl ? data.redirectUrl : null;
      if (redirectUrl) {
        // use a full-page navigation so HMS server can set HttpOnly cookie
        window.location.href = redirectUrl;
        return;
      }

      // If no redirectUrl was returned, provide helpful debug info
      console.error('[openHostelSSO] no redirectUrl, response=', data);
      toast.error('Hostel SSO unavailable. Check HMS server or CMS SSO settings.');
      if (data && data.redirectUrl === undefined) {
        // show the CMS SSO endpoint we attempted to call
        // eslint-disable-next-line no-console
        console.debug('[openHostelSSO] called:', `${CMS_BASE_URL.replace(/\/$/, '')}/sso/redirect`);
      }
    } catch (err) {
      console.error('openHostelSSO failed', err);
      toast.error('Hostel SSO failed. See console for details.');
    }
  };

  return (
    <div className="shadow-md px-6 py-4 mb-6 bg-white">
      <div className="max-w-7xl flex justify-between items-center mx-auto">
        <div className="flex items-center gap-6">
          {/* Dashboard Title */}
          <p
            className="font-semibold text-2xl flex justify-center items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <span className="mr-2">
              <RxDashboard />
            </span>{" "}
            {router.state && router.state.type
              ? `${router.state.type} Dashboard`
              : "Dashboard"}
          </p>

          {/* ✅ Show Hostel and Lost & Found links for students */}
          {(userType === "Student" || (reduxUser && (reduxUser.enrollmentNo || reduxUser.role === 'student'))) && (
            <>
              <p
                className="text-lg font-medium cursor-pointer hover:text-blue-600"
                onClick={openHostelSSO}
              >
                Hostel
              </p>
              <p
                className="text-lg font-medium cursor-pointer hover:text-blue-600"
                onClick={() => navigate("/lost-and-found")}
              >
                Lost & Found
              </p>
            </>
          )}

          {/* ✅ Show Hostel Admin link only for faculty with hostel admin designation */}
          {(reduxUser && reduxUser.role === 'faculty' && reduxUser.designation && 
            (reduxUser.designation.toLowerCase().includes('hostel admin') || 
             reduxUser.designation.toLowerCase().includes('hostel administrator'))) && (
            <p
              className="text-lg font-medium cursor-pointer hover:text-blue-600"
              onClick={openHostelSSO}
            >
              Hostel Admin
            </p>
          )}
        </div>

        <CustomButton variant="danger" onClick={logouthandler}>
          Logout
          <span className="ml-2">
            <FiLogOut />
          </span>
        </CustomButton>
      </div>
    </div>
  );
};

export default Navbar;
