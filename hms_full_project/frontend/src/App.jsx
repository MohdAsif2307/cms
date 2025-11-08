import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import SsoComplete from "./pages/SsoComplete";
import Dashboard from "./pages/Dashboard";
import Notices from "./pages/Notices";
import Complaints from "./pages/Complaints";
import Entry from "./pages/Entry";
import AdminOccupancy from "./pages/admin/Occupancy";
import AdminReports from "./pages/admin/Reports";
import NoticesAdmin from "./pages/admin/NoticesAdmin";
import ComplaintsAdmin from "./pages/admin/ComplaintsAdmin";
import EntryLogs from "./pages/admin/EntryLogs";
import { AuthProvider, useAuth } from "./hooks/useAuth";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
  <Route path="/sso/complete" element={<SsoComplete />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/notices"
          element={
            <PrivateRoute>
              <Notices />
            </PrivateRoute>
          }
        />
        <Route
          path="/complaints"
          element={
            <PrivateRoute>
              <Complaints />
            </PrivateRoute>
          }
        />
        <Route
          path="/entry"
          element={
            <PrivateRoute>
              <Entry />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/notices"
          element={
            <AdminRoute>
              <NoticesAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/complaints"
          element={
            <AdminRoute>
              <ComplaintsAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/entries"
          element={
            <AdminRoute>
              <EntryLogs />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/occupancy"
          element={
            <AdminRoute>
              <AdminOccupancy />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <AdminReports />
            </AdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
