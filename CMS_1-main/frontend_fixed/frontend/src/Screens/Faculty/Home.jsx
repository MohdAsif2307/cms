import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import Notice from "../Notice";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import normalizeUser from "../../utils/normalizeUser";
import { getBranchNameById } from "../../utils/branchCache";
import axiosWrapper from "../../utils/AxiosWrapper";
import Timetable from "./Timetable";
import Material from "./Material";
import StudentFinder from "./StudentFinder";
import Profile from "./Profile";
import Marks from "./AddMarks";
import Exam from "../Exam";

const MENU_ITEMS = [
  { id: "home", label: "Home", component: null },
  { id: "timetable", label: "Timetable", component: Timetable },
  { id: "material", label: "Material", component: Material },
  { id: "notice", label: "Notice", component: Notice },
  { id: "student info", label: "Student Info", component: StudentFinder },
  { id: "marks", label: "Marks", component: Marks },
  { id: "exam", label: "Exam", component: Exam },
];

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState("Home");
  const [profileData, setProfileData] = useState(null);
  const dispatch = useDispatch();
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosWrapper.get("/faculty/my-details", {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (response.data.success) {
          let normalized = normalizeUser(response.data.data, 'Faculty');
          // If branchId is only an id, try to fetch the branch name and attach it
          if (normalized.branchId && normalized.branchId._id && !normalized.branchId.name) {
            const name = await getBranchNameById(normalized.branchId._id);
            if (name) {
              normalized = { ...normalized, branchId: { ...normalized.branchId, name } };
            }
          }
          setProfileData(normalized);
          dispatch(setUserData(normalized));
        }
      } catch (error) {
        toast.error("Failed to load profile");
      }
    };

    fetchUserDetails();
  }, [dispatch, userToken]);

  const getMenuItemClass = (menuId) => {
    const isSelected = selectedMenu.toLowerCase() === menuId.toLowerCase();
    return `text-center px-6 py-3 cursor-pointer font-medium text-sm w-full rounded-md ${
      isSelected
        ? "bg-blue-500 text-white"
        : "bg-blue-50 text-blue-700 hover:bg-blue-100"
    }`;
  };

  const renderContent = () => {
    if (selectedMenu === "Home" && profileData) {
      return <Profile profileData={profileData} />;
    }

    const menuItem = MENU_ITEMS.find(
      (item) => item.label.toLowerCase() === selectedMenu.toLowerCase(),
    );

    if (menuItem && menuItem.component) {
      const Component = menuItem.component;
      return <Component />;
    }

    return null;
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <ul className="flex justify-evenly items-center gap-10 w-full mx-auto my-8">
          {MENU_ITEMS.map((item) => (
            <li
              key={item.id}
              className={getMenuItemClass(item.id)}
              onClick={() => setSelectedMenu(item.label)}
            >
              {item.label}
            </li>
          ))}
        </ul>

        {renderContent()}
      </div>
      <Toaster position="bottom-center" />
    </>
  );
};

export default Home;
