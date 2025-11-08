import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../utils/api";

export default function ComplaintsAdmin() {
  const [complaints, setComplaints] = useState([]);

  async function load() {
    try {
      const res = await api.get("/complaints/all");
      setComplaints(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function updateStatus(id, status) {
    try {
      await api.put(`/complaints/${id}/status`, { status });
      alert(`Marked as ${status}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Manage Complaints</h1>
      <div className="space-y-3">
        {complaints.map((c) => (
          <div key={c._id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm text-slate-700">{c.description}</div>
                <div className="text-xs text-slate-500 mt-1">
                  by {c.student?.name || "Unknown"} ({c.student?.email})
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  c.status === "pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : c.status === "sorted"
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {c.status}
              </span>
            </div>
            <div className="mt-3 space-x-2">
              {["pending", "sorted", "rejected"].map((st) => (
                <button
                  key={st}
                  onClick={() => updateStatus(c._id, st)}
                  className={`px-3 py-1 rounded text-white ${
                    st === "sorted"
                      ? "bg-green-600"
                      : st === "rejected"
                      ? "bg-red-600"
                      : "bg-yellow-500"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
