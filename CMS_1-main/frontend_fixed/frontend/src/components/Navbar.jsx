import React from "react";
import { FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { CMS_BASE_URL } from "../baseUrl";
import { RxDashboard } from "react-icons/rx";
import CustomButton from "./CustomButton";

const Navbar = () => {
  const router = useLocation();
  const navigate = useNavigate();

  const logouthandler = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userType");
    navigate("/login");
  };

  const userType = localStorage.getItem("userType");

  const openHostelSSO = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) return navigate('/login');
      const res = await fetch(`${CMS_BASE_URL.replace(/\/$/, '')}/sso/redirect`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      const redirectUrl = data.redirectUrl;
      if (redirectUrl) {
        // use a full-page navigation so HMS server can set HttpOnly cookie
        window.location.href = redirectUrl;
        return;
      }
    } catch (err) {
      console.error('openHostelSSO failed', err);
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

          {/* ✅ Show Hostel link for students */}
          {userType === "Student" && (
            <p
              className="text-lg font-medium cursor-pointer hover:text-blue-600"
              onClick={openHostelSSO}
            >
              Hostel
            </p>
          )}

          {/* ✅ Show Hostel Admin link for Hostel Administrator */}
          {userType === "Faculty" && (
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
