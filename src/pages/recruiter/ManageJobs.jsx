import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/jobs")
      .then(res => setJobs(res.data))
      .catch(() => console.log("BE chưa chạy"));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Quản lý tin tuyển dụng
        </h1>

        <div className="space-y-4">
          {jobs.map(job => (
            <div
              key={job._id}
              className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-bold text-slate-800">{job.title}</h2>
              <p className="text-slate-500">{job.location}</p>
              <p className="text-slate-600 mt-2 line-clamp-2">{job.description}</p>

              <div className="flex gap-4 mt-4">
                <Link
                  to={`/recruiter/applicants/${job._id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Xem ứng viên
                </Link>

                <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                  Sửa
                </button>

                <button className="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50">
                  Xoá
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
