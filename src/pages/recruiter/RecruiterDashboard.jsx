import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Briefcase, Users, FilePlus, ListChecks } from "lucide-react";

export default function RecruiterDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token"); // ✅ FIX LỖI TOKEN

  const [company, setCompany] = useState(null);
  const [stats, setStats] = useState({
    postedJobs: 0,
    newApplicants: 0,
    pending: 0,
    accepted: 0,
  });

  /* ================= FETCH COMPANY ================= */
  const fetchCompany = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/company/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("👉 COMPANY:", res.data.data);
      setCompany(res.data.data);
    } catch (err) {
      console.log("❌ fetchCompany error:", err);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchCompany();
  }, [token]);

  /* ================= FETCH STATS ================= */
  useEffect(() => {
    if (user?._id) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/jobs/stats/${user._id}`)
        .then((res) => setStats(res.data))
        .catch((err) => console.log(err));
    }
  }, [user?._id]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl p-6 hidden md:block pt-20">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Nhà tuyển dụng
        </h2>

        <nav className="flex flex-col gap-4 text-gray-700 font-medium">
          <Link to="/recruiter/dashboard" className="hover:text-blue-600">
            🔹 Dashboard
          </Link>

          <Link
            to="/recruiter/company-profile"
            className="hover:text-blue-600"
          >
            🔹 Account Setting
          </Link>

          {/* ✅ XEM TRANG CÔNG TY */}
          {company && (
            <Link
              to={`/recruiter/company/${company._id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              🔗 Xem trang công ty
            </Link>
          )}

          <Link to="/recruiter/create-job" className="hover:text-blue-600">
            🔹 Tạo tin tuyển dụng
          </Link>

          <Link to="/recruiter/manage-jobs" className="hover:text-blue-600">
            🔹 Quản lý tin tuyển dụng
          </Link>

          <Link to="/recruiter/applicants" className="hover:text-blue-600">
            🔹 Danh sách ứng viên
          </Link>

          <Link to="/recruiter/profile" className="hover:text-blue-600">
            🔹 Hồ sơ nhà tuyển dụng
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 p-8 mt-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800">
            Dashboard nhà tuyển dụng
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý tuyển dụng nhanh chóng & hiệu quả
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-gray-700">
              Tin đã đăng
            </h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {stats.postedJobs}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-gray-700">
              Ứng viên mới
            </h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {stats.newApplicants}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-gray-700">
              Đang chờ duyệt
            </h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {stats.pending}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-lg font-semibold text-gray-700">
              Đã tuyển
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.accepted}
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <Link to="/recruiter/create-job" className="bg-white shadow-xl rounded-2xl p-8">
            <FilePlus size={34} className="text-blue-600 mb-3" />
            <h2 className="text-xl font-semibold">Tạo tin tuyển dụng</h2>
          </Link>

          <Link to="/recruiter/manage-jobs" className="bg-white shadow-xl rounded-2xl p-8">
            <Briefcase size={34} className="text-green-600 mb-3" />
            <h2 className="text-xl font-semibold">Quản lý tin tuyển dụng</h2>
          </Link>

          <Link to="/recruiter/applicants" className="bg-white shadow-xl rounded-2xl p-8">
            <Users size={34} className="text-purple-600 mb-3" />
            <h2 className="text-xl font-semibold">Danh sách ứng viên</h2>
          </Link>

          <Link to="/recruiter/applicants/manage" className="bg-white shadow-xl rounded-2xl p-8">
            <ListChecks size={34} className="text-orange-600 mb-3" />
            <h2 className="text-xl font-semibold">Xử lý đơn ứng tuyển</h2>
          </Link>
        </div>
      </div>
    </div>
  );
}
