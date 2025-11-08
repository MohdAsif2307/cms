import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-blue-700 text-white p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">🏨 Hostel Management System</h1>
        <nav className="space-x-4">
          {user?.role === "admin" ? (
            <>
              <Link to="/admin/notices" className="hover:underline">
                Notices
              </Link>
              <Link to="/admin/complaints" className="hover:underline">
                Complaints
              </Link>
              <Link to="/admin/entries" className="hover:underline">
                Entries
              </Link>
              <Link to="/admin/occupancy" className="hover:underline">
                Occupancy
              </Link>
              <Link to="/admin/reports" className="hover:underline">
                Reports
              </Link>
            </>
          ) : (
            <>
              <Link to="/" className="hover:underline">
                Dashboard
              </Link>
              <Link to="/notices" className="hover:underline">
                Notices
              </Link>
              <Link to="/complaints" className="hover:underline">
                Complaints
              </Link>
              <Link to="/entry" className="hover:underline">
                Entry
              </Link>
            </>
          )}
          {/* ✅ FIXED LINE BELOW */}
          <button onClick={logout} className="ml-4 bg-red-600 px-3 py-1 rounded">
            Logout
          </button>
        </nav>
      </header>

      {/* Page body */}
      <main className="flex-1 bg-gray-50 p-6">{children}</main>
    </div>
  );
}
