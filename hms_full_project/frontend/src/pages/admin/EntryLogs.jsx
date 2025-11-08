import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import api from "../../utils/api";
import dayjs from "dayjs";

export default function EntryLogs() {
  const [entries, setEntries] = useState([]);
  const [type, setType] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  async function load() {
    try {
      const params = new URLSearchParams();
      if (type) params.append("type", type);
      if (start && end) {
        params.append("start", start);
        params.append("end", end);
      }
      const res = await api.get(`/entry/all?${params.toString()}`);
      setEntries(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <Layout>
      <h1 className="text-2xl font-semibold mb-4">Student Entry/Exit Logs</h1>

      <div className="bg-white p-4 rounded shadow mb-5">
        <div className="flex flex-wrap gap-3 items-end">
          <div>
            <label className="block text-sm font-semibold">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">All</option>
              <option value="entry">Entry</option>
              <option value="exit">Exit</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold">Start Date</label>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">End Date</label>
            <input
              type="datetime-local"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="border p-2 rounded"
            />
          </div>
          <button
            onClick={load}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Filter
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {entries.map((e) => (
          <div key={e._id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between">
              <div>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    e.type === "entry"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {e.type}
                </span>
                <div className="text-sm text-slate-600 mt-1">
                  {dayjs(e.timestamp).format("DD MMM YYYY, HH:mm")}
                </div>
              </div>
              <div className="text-right text-sm text-slate-700">
                {e.student?.name}
                <br />
                <span className="text-xs text-slate-500">
                  {e.student?.email}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
