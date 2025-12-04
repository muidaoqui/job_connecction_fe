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
        "http://localhost:8080/api/jobs/applications/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("DATA APPS:", res.data);
      setApps(res.data.apps || []);

      setLoading(false);
    } catch (err) {
      console.log("Lỗi tải ứng viên:", err);
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  const renderStatusBadge = (status) => {
    const style = {
      accepted: "bg-green-100 text-green-700 border-green-300",
      rejected: "bg-red-100 text-red-700 border-red-300",
      applied: "bg-gray-100 text-gray-700 border-gray-300",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full border text-sm font-medium ${style[status]}`}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Ứng viên đã ứng tuyển
        </h1>

        {loading && <p className="text-gray-600">Đang tải dữ liệu...</p>}

        {!loading && apps.length === 0 && (
          <p className="text-gray-600">Chưa có ứng viên nào.</p>
        )}

        <div className="space-y-4">
          {apps.map((app) => (
            <div
              key={app._id}
              className="bg-white p-6 rounded-xl shadow border hover:shadow-lg transition"
            >
              {/* Thông tin ứng viên */}
              <div className="flex items-start justify-between">
                <div>
                  {/* Tên ứng viên */}
                  <div className="flex items-center gap-2 mb-1">
                    <User className="text-blue-600" size={20} />
                    <p className="text-lg font-semibold">
                      {app.userId?.name || app.name || "Không có tên"}
                    </p>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-2 mb-2 text-gray-700">
                    <Mail size={18} className="text-red-600" />
                    <span>
                      {app.userId?.email || app.email || "Không có email"}
                    </span>
                  </div>

                  {/* Job Title */}
                  <div className="flex items-center gap-2 text-gray-700">
                    <Briefcase size={18} className="text-orange-600" />
                    <span className="font-medium">
                      {app.jobId?.title || "Không có dữ liệu công việc"}
                    </span>
                  </div>
                </div>

                {/* Trạng thái */}
                <div>{renderStatusBadge(app.status)}</div>
              </div>

              {/* Lời nhắn */}
              {app.message && (
                <p className="mt-4 text-gray-700 italic">{app.message}</p>
              )}

              {/* CV */}
              {app.cvFile && (
                <p className="mt-3">
                  <strong>CV:</strong>{" "}
                  <a
                    href={`http://localhost:8080/${app.cvFile}`}
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    Xem CV
                  </a>
                </p>
              )}

              {/* Nút hành động */}
              {app.status === "applied" || app.status === "pending" ? (
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => updateStatus(app._id, "accepted")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    <CheckCircle size={18} /> Duyệt hồ sơ
                  </button>

                  <button
                    onClick={() => updateStatus(app._id, "rejected")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    <XCircle size={18} /> Từ chối
                  </button>
                </div>
              ) : (
                <p className="mt-4 text-gray-700 italic">Đã xử lý</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
