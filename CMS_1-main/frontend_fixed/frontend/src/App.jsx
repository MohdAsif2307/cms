import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import mystore from "./redux/store";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import FacultyLayout from "./layouts/FacultyLayout";
import StudentLayout from "./layouts/StudentLayout";

import Login from "./Screens/Login";
import ForgotPassword from "./Screens/ForgetPassword";
import ResetPassword from "./Screens/UpdatePassword";
import Dashboard from "./Screens/Dashboard";
import FacultyHome from "./Screens/Faculty/Home";
import StudentHome from "./Screens/Student/Home";
import AdminHome from "./Screens/Admin/Home";
import Student from "./Screens/Admin/Student";
import Faculty from "./Screens/Admin/Faculty";
import Subject from "./Screens/Admin/Subject";
import Branch from "./Screens/Admin/Branch";
import Profile from "./Screens/Profile";
import UploadMarks from "./Screens/Faculty/UploadMarks";
import HostelAdminDashboard from "./Screens/Hostel/AdminDashboard";
import StudentHostelDetails from "./Screens/Hostel/StudentDetails";
import LostAndFound from "./pages/LostAndFound";

const App = () => {
  return (
    <Provider store={mystore}>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          {/* Default route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 🔐 Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* 🧑‍💼 Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminHome />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/student"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Student />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/faculty"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Faculty />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/subject"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Subject />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/branch"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Branch />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* 👨‍🏫 Faculty Routes */}
          <Route
            path="/faculty"
            element={
              <ProtectedRoute>
                <FacultyLayout>
                  <FacultyHome />
                </FacultyLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty/upload-marks"
            element={
              <ProtectedRoute>
                <FacultyLayout>
                  <UploadMarks />
                </FacultyLayout>
              </ProtectedRoute>
            }
          />

          {/* 👩‍🎓 Student Routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute>
                <StudentLayout>
                  <StudentHome />
                </StudentLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/lost-and-found"
            element={
              <ProtectedRoute>
                <StudentLayout>
                  <LostAndFound />
                </StudentLayout>
              </ProtectedRoute>
            }
          />

          {/* 🏠 Hostel Management (Integrated) */}
          <Route
            path="/hostel-admin"
            element={
              <ProtectedRoute>
                <FacultyLayout>
                  <HostelAdminDashboard />
                </FacultyLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/hostel"
            element={
              <ProtectedRoute>
                <StudentLayout>
                  <StudentHostelDetails />
                </StudentLayout>
              </ProtectedRoute>
            }
          />

          {/* 👤 Common Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
    </Provider>
  );
};

export default App;
