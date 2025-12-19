import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, User, Briefcase, Mail } from "lucide-react";

export default function Applicants() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchApps = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:8080/api/recruiter/applications",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setApps(res.data.applications || []);
  } catch (err) {
    console.log("Lỗi tải ứng viên:", err);
  } finally {
    setLoading(false);
  }
};

  const updateStatus = async (appId, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8080/api/jobs/applications/${appId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchApps();
    } catch (err) {
      console.log("Lỗi cập nhật trạng thái:", err);
    }
  };


 useEffect(() => {
  fetchApps();
}, []);

  const statusBadge = {
    accepted: "bg-green-100 text-green-700 border border-green-300",
    rejected: "bg-red-100 text-red-700 border border-red-300",
    pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    applied: "bg-gray-100 text-gray-700 border border-gray-300",
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Ứng viên đã ứng tuyển
        </h1>

        {loading && <p className="text-gray-600">Đang tải dữ liệu...</p>}

        {!loading && apps.length === 0 && (
          <p className="text-gray-600">Chưa có ứng viên nào.</p>
        )}

        {!loading && apps.length > 0 && (
          <div className="overflow-x-auto shadow-xl rounded-xl bg-white p-5 border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                  <th className="p-4">Ứng viên</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Công việc</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4">Hành động</th>
                </tr>
              </thead>

              <tbody>
                {apps.map((app) => (
                  <tr
                    key={app._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium">
                      {app.userId?.name || app.name || "Không tên"}
                    </td>

                    <td className="p-4 text-gray-700">
                      {app.userId?.email || app.email}
                    </td>

                    <td className="p-4 text-gray-700">
                      {app.jobId?.title || "Không có dữ liệu"}
                    </td>

                    {/* Badge trạng thái */}
                    <td className="p-4">
                      <span
                        className={`text-sm px-3 py-1 rounded-full ${statusBadge[app.status]}`}
                      >
                        {app.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-4">
                      {app.status === "accepted" ||
                      app.status === "rejected" ? (
                        <span className="italic text-gray-500">Đã xử lý</span>
                      ) : (
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              updateStatus(app._id, "accepted")
                            }
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                          >
                            <CheckCircle size={16} /> Duyệt
                          </button>

                          <button
                            onClick={() =>
                              updateStatus(app._id, "rejected")
                            }
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1"
                          >
                            <XCircle size={16} /> Từ chối
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}