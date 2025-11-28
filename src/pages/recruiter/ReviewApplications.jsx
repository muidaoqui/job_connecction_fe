import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ReviewApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/jobs/applications/all");
      setApplications(res.data.apps || []);
    } catch (err) {
      console.error("Lỗi lấy ứng viên:", err);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      await axios.put(
        `http://localhost:8080/api/jobs/applications/${appId}/status`,
        { status }
      );

      // cập nhật UI
      setApplications((prev) =>
        prev.map((app) =>
          app._id === appId ? { ...app, status } : app
        )
      );
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
    }
  };

  return (
    <div className="p-10 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Xử lý đơn ứng tuyển</h1>

      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        {applications.length === 0 ? (
          <p className="text-gray-500">Không có đơn ứng tuyển nào.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-100">
                <th className="p-3">Ứng viên</th>
                <th className="p-3">Công việc</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-b hover:bg-gray-50">
                  {/* HIỆN TÊN ỨNG VIÊN */}
                  <td className="p-3">{app.name}</td>

                  <td className="p-3">{app.jobId?.title}</td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        app.status === "accepted"
                          ? "bg-green-500"
                          : app.status === "rejected"
                          ? "bg-red-500"
                          : "bg-gray-400"
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>

                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => updateStatus(app._id, "accepted")}
                      className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Duyệt
                    </button>

                    <button
                      onClick={() => updateStatus(app._id, "rejected")}
                      className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Từ chối
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
