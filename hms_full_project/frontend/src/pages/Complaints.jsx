import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function loadComplaints() {
    try {
      const res = await api.get("/complaints/my");
      setComplaints(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadComplaints();
  }, []);

  async function submitComplaint(e) {
    e.preventDefault();
    try {
      await api.post("/complaints", { title, description });
      setTitle("");
      setDescription("");
      alert("Complaint submitted successfully!");
      loadComplaints();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit complaint");
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">My Complaints</h1>

      {/* New Complaint Form */}
      <form
        onSubmit={submitComplaint}
        className="bg-white p-4 rounded shadow mb-6"
      >
        <label className="block font-semibold mb-1">Title</label>
        <input
          className="border p-2 w-full rounded mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter complaint title"
          required
        />

        <label className="block font-semibold mb-1">Description</label>
        <textarea
          className="border p-2 w-full rounded mb-3"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your issue"
          required
        />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit Complaint
        </button>
      </form>

      {/* My Complaints List */}
      <div className="space-y-3">
        {complaints.length === 0 ? (
          <p className="text-gray-600">No complaints yet.</p>
        ) : (
          complaints.map((c) => (
            <div
              key={c._id}
              className="bg-white p-4 rounded shadow hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-semibold text-lg">{c.title}</h3>
                <span
                  className={`px-2 py-1 rounded text-xs capitalize ${
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
              <p className="text-slate-700">{c.description}</p>
              <div className="text-xs text-slate-500 mt-2">
                Submitted on {new Date(c.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
}
