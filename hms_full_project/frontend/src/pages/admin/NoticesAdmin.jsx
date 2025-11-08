import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../utils/api";

export default function NoticesAdmin() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [notices, setNotices] = useState([]);

  async function load() {
    try {
      const res = await api.get("/notices/all");
      setNotices(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function postNotice(e) {
    e.preventDefault();
    try {
      await api.post("/notices", { title, body });
      setTitle("");
      setBody("");
      alert("Notice posted successfully!");
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to post notice");
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold">Manage Notices</h1>

      <form onSubmit={postNotice} className="bg-white p-4 rounded shadow mt-4">
        <label className="block font-semibold mb-1">Title</label>
        <input
          className="border p-2 w-full rounded mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label className="block font-semibold mb-1">Body</label>
        <textarea
          className="border p-2 w-full rounded mb-3"
          rows="3"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Post Notice
        </button>
      </form>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-3">All Notices</h2>
        <div className="space-y-3">
          {notices.map((n) => (
            <div
              key={n._id}
              className="bg-white p-4 rounded shadow hover:shadow-md transition"
            >
              <div className="font-bold text-lg">{n.title}</div>
              <div className="text-slate-700">{n.body}</div>
              <div className="text-xs text-slate-500 mt-1">
                Posted by {n.author?.name || "Admin"} on{" "}
                {new Date(n.postedAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
