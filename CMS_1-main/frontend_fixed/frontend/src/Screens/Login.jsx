import React, { useState, useEffect } from "react";
import { FiLogIn } from "react-icons/fi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { setUserToken } from "../redux/actions";
import { useDispatch } from "react-redux";
import CustomButton from "../components/CustomButton";
import axiosWrapper from "../utils/AxiosWrapper";

const USER_TYPES = {
  STUDENT: "Student",
  FACULTY: "Faculty",
  ADMIN: "Admin",
};

const LoginForm = ({ selected, onSubmit, formData, setFormData }) => (
  <form
    className="w-full p-8 bg-white rounded-2xl shadow-xl border border-gray-200"
    onSubmit={onSubmit}
  >
    <div className="mb-6">
      <label
        className="block text-gray-800 text-sm font-medium mb-2"
        htmlFor="email"
      >
        {selected} Email
      </label>
      <input
        type="email"
        id="email"
        required
        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
    </div>
    <div className="mb-6">
      <label
        className="block text-gray-800 text-sm font-medium mb-2"
        htmlFor="password"
      >
        Password
      </label>
      <input
        type="password"
        id="password"
        required
        className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
    </div>
    <div className="flex items-center justify-between mb-6">
      <Link
        className="text-sm text-blue-600 hover:underline"
        to="/forget-password"
      >
        Forgot Password?
      </Link>
    </div>
    <CustomButton
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition duration-200 flex justify-center items-center gap-2"
    >
      Login
      <FiLogIn className="text-lg" />
    </CustomButton>
  </form>
);

const UserTypeSelector = ({ selected, onSelect }) => (
  <div className="flex justify-center gap-4 mb-8">
    {Object.values(USER_TYPES).map((type) => (
      <button
        key={type}
        onClick={() => onSelect(type)}
        className={`px-5 py-2 text-sm font-medium rounded-full transition duration-200 ${
          selected === type
            ? "bg-blue-600 text-white shadow"
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }`}
      >
        {type}
      </button>
    ))}
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get("type");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [selected, setSelected] = useState(USER_TYPES.STUDENT);

  // Seeded credentials for local development convenience
  const SEEDED_CREDS = {
    Student: { email: 'student1@college.edu', password: 'student123' },
    Faculty: { email: 'faculty1@college.edu', password: 'faculty123' },
    Admin: { email: 'admin@gmail.com', password: 'admin123' },
  };

  // In dev mode, prefill the form with seeded credentials for the selected user type
  useEffect(() => {
    try {
      if (import.meta?.env?.DEV) {
        setFormData(SEEDED_CREDS[selected] || { email: '', password: '' });
      }
    } catch (e) {
      // import.meta may not exist in some tooling — ignore silently
    }
  }, [selected]);

  const handleUserTypeSelect = (type) => {
    const userType = type.toLowerCase();
    setSelected(type);
    setSearchParams({ type: userType });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axiosWrapper.post(
        `/${selected.toLowerCase()}/login`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      // Extract data
      const respData = response.data.data || {};
      const { token, user, hms } = respData;
      if (token) {
        localStorage.setItem("userToken", token);
        localStorage.setItem("userType", selected);
        dispatch(setUserToken(token));
      }
      // After storing token, fetch canonical user details from the backend
      // (e.g. /faculty/my-details, /student/my-details, /admin/my-details).
      // This ensures the app has the full, canonical user object for layouts
      // and role-specific screens.
      try {
        const rolePath = `/${selected.toLowerCase()}`;
        const meResp = await axiosWrapper.get(`${rolePath}/my-details`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const me = meResp?.data?.data || user || null;
        if (me) {
          // use shared normalizer and attach hms/token when available
          const normalized = (await import("../utils/normalizeUser")).default(me, selected, hms, token);

          // debug: show what we're about to dispatch and localStorage
          try {
            if (import.meta?.env?.DEV || localStorage.getItem('AXIOS_DEBUG') === '1') {
              // eslint-disable-next-line no-console
              console.debug('[Login] dispatching normalized user:', normalized);
              // eslint-disable-next-line no-console
              console.debug('[Login] localStorage keys userType, userToken, token:', localStorage.getItem('userType'), localStorage.getItem('userToken'), localStorage.getItem('token'));
            }
          } catch (e) {}

          // persist user for quick UI hydration (legacy components/readers may rely on it)
          try { localStorage.setItem('userData', JSON.stringify(normalized)); } catch (e) {}
          dispatch({ type: 'LOGIN_SUCCESS', payload: normalized });
          dispatch({ type: 'USER_DATA', payload: normalized });
        }
      } catch (e) {
        // If the /my-details call fails, fall back to any user object returned
        if (user) {
          try {
            const normalized = (await import("../utils/normalizeUser")).default(user, selected, hms, token);
            // eslint-disable-next-line no-console
            if (import.meta?.env?.DEV || localStorage.getItem('AXIOS_DEBUG') === '1') console.debug('[Login] falling back and dispatching user:', normalized);
            dispatch({ type: 'LOGIN_SUCCESS', payload: normalized });
            dispatch({ type: 'USER_DATA', payload: normalized });
          } catch (ex) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: user });
            dispatch({ type: 'USER_DATA', payload: user });
          }
        }
      }

      // If HMS info present and contains an HMS token, open HMS frontend in a new tab
      if (hms && (hms.token || hms.hmsToken || hms.frontendUrl)) {
        const frontend = hms.frontendUrl || hms.hmsFrontendUrl || hms.frontend || null;
        const hmsToken = hms.token || hms.hmsToken || null;
        if (frontend) {
          try {
            const url = new URL(frontend);
            if (hmsToken) url.searchParams.set('cms_hms_token', hmsToken);
            if (hms.hostelStudentId) url.searchParams.set('hostelStudentId', hms.hostelStudentId);
            window.open(url.toString(), '_blank');
          } catch (e) {
            // if frontend isn't a full URL, try to open as provided
            const sep = frontend.includes('?') ? '&' : '?';
            const full = hmsToken ? `${frontend}${sep}cms_hms_token=${hmsToken}` : frontend;
            window.open(full, '_blank');
          }
        }
      }

      // ✅ Redirect Logic for CMS UI
      if (selected === USER_TYPES.FACULTY) {
        // If backend returned user and designation is hostel admin, also navigate to CMS hostel-admin page
        if (user?.designation === "Hostel Administrator") {
          navigate("/hostel-admin");
          return;
        }
        navigate("/faculty");
        return;
      }

      if (selected === USER_TYPES.STUDENT) {
        navigate("/student");
        return;
      }

      if (selected === USER_TYPES.ADMIN) {
        navigate("/admin");
        return;
      }
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      navigate(`/${localStorage.getItem("userType").toLowerCase()}`);
    }
  }, [navigate]);

  useEffect(() => {
    if (type) {
      const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
      setSelected(capitalizedType);
    }
  }, [type]);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 via-white to-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl lg:w-1/2 px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
          {selected} Login
        </h1>
        <UserTypeSelector selected={selected} onSelect={handleUserTypeSelect} />
        <LoginForm
          selected={selected}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
        />
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default Login;
