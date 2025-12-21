import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const API = import.meta.env.VITE_API_URL;
  const fetchJobs = async () => {
    try {
      const res = await axios.get(`${API}/api/jobs`);
      // 🔥 FIX CHỖ NÀY
      setJobs(res.data.data || []);
    } catch (err) {
      console.log("Lỗi lấy danh sách job", err);
      setJobs([]);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const deleteJob = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá tin này?")) return;

    try {
      await axios.delete(`${API}/api/jobs/${id}`);
      alert("Xoá thành công!");
      fetchJobs();
    } catch (err) {
      console.log(err);
      alert("Xoá thất bại!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">
          Quản lý tin tuyển dụng
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {jobs.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              Chưa có tin tuyển dụng nào
            </p>
          )}

          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                {job.title}
              </h2>

              <div className="flex items-center text-gray-500 gap-1 mb-2">
                <MapPin size={16} className="text-red-500" />
                <span className="text-sm">{job.location}</span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {job.description || "Không có mô tả"}
              </p>

              <div className="flex items-center justify-between mt-4">
                <Link
                  to={`/recruiter/applicants/${job._id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Xem ứng viên
                </Link>

                <div className="flex gap-3">
                  <Link
                    to={`/recruiter/edit-job/${job._id}`}
                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                  >
                    Sửa
                  </Link>

                  <button
                    onClick={() => deleteJob(job._id)}
                    className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    Xoá
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
