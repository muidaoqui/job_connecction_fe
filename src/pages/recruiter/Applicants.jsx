import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function Applicants() {
  const { jobId } = useParams();
  const [apps, setApps] = useState([]);

  // Lấy danh sách ứng viên theo job
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/recruiter/applications/job/${jobId}`)
      .then((res) => {
        // BE trả về { success: true, applications: [...] }
        setApps(res.data.applications || []);
      })
      .catch((err) => console.log(err));
  }, [jobId]);

  // Cập nhật trạng thái đơn ứng tuyển
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:8080/api/recruiter/applications/${id}/status`,
        { status }
      );

      // Cập nhật UI sau khi duyệt / từ chối
      setApps((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Danh sách ứng viên
        </h1>

        {apps.length === 0 && (
          <p className="text-gray-600">Không có ứng viên nào ứng tuyển.</p>
        )}

        <div className="space-y-4">
          {apps.map((app) => (
            <div
              key={app._id}
              className="bg-white p-5 rounded-xl shadow border"
            >
              <p>
                <span className="font-semibold">Tên ứng viên:</span>{" "}
                {app.userId?.name}
              </p>
              <p>
                <span className="font-semibold">Email:</span>{" "}
                {app.userId?.email}
              </p>
              <p>
                <span className="font-semibold">Trạng thái:</span>{" "}
                {app.status}
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  onClick={() => updateStatus(app._id, "accepted")}
                >
                  Duyệt
                </button>

                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  onClick={() => updateStatus(app._id, "rejected")}
                >
                  Từ chối
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
