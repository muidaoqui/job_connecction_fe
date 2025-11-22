import { useEffect, useState } from "react";
import axios from "axios";

export default function Applicants() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/jobs/applications/all")
      .then((res) => setApps(res.data.apps || []))
      .catch((err) => console.log("Lỗi lấy ứng viên:", err));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Danh sách ứng viên
        </h1>

        {apps.length === 0 && (
          <p className="text-gray-600">Chưa có ứng viên nào.</p>
        )}

        {apps.map((app) => (
          <div key={app._id} className="bg-white p-5 rounded-xl shadow mb-3">
            <p><strong>Tên:</strong> {app.name}</p>
            <p><strong>Email:</strong> {app.email}</p>
            <p><strong>Lời nhắn:</strong> {app.message}</p>

            <p>
              <strong>CV:</strong>{" "}
              <a
                href={`http://localhost:8080/${app.cvFile}`}
                className="text-blue-600 underline"
                target="_blank"
              >
                Xem CV
              </a>
            </p>

            <p>
              <strong>Công việc ứng tuyển:</strong>{" "}
              {app.jobId?.title || "Không có"}
            </p>

            <p><strong>Trạng thái:</strong> {app.status}</p>
          </div>
        ))}

      </div>
    </div>
  );
}
