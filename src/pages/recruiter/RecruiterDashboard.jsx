import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Briefcase, Users, FilePlus, ListChecks } from "lucide-react";

export default function RecruiterDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [company, setCompany] = useState(null);
  const [stats, setStats] = useState({
    postedJobs: 0,
    newApplicants: 0,
    pending: 0,
    accepted: 0,
  });

  /* ================= FETCH COMPANY ================= */
  useEffect(() => {
  // 🔥 ƯU TIÊN LẤY COMPANY TỪ LOCALSTORAGE
  const storedCompany = localStorage.getItem("company");

  if (storedCompany) {
    setCompany(JSON.parse(storedCompany));
    return;
  }

  // ⬇️ FALLBACK: gọi API nếu local chưa có
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

      if (res.data?.data) {
        setCompany(res.data.data);
        localStorage.setItem("company", JSON.stringify(res.data.data));
      }
    } catch (error) {
      console.log("❌ fetchCompany error:", error);
    }
  };

  if (token) fetchCompany();
}, [token]);

  /* ================= FETCH STATS ================= */
  useEffect(() => {
    if (user?._id) {
      axios
  .get(`${import.meta.env.VITE_API_URL}/api/jobs/recruiter/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  .then((res) => setStats(res.data))
  .catch((err) => console.log(err));
    }
  }, [user?._id]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white shadow-xl p-6 hidden md:block pt-20">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Nhà tuyển dụng
        </h2>

        <nav className="flex flex-col gap-4 text-gray-700 font-medium">
          <Link to="/recruiter/dashboard" className="hover:text-blue-600 transition">
            🔹 Dashboard
          </Link>

          <Link to="/recruiter/company-profile" className="hover:text-blue-600 transition">
            🔹 Account Setting
          </Link>

          {company && (
            <Link
              to={`/recruiter/company/${company._id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              🔗 Xem trang công ty
            </Link>
          )}

          <Link to="/recruiter/create-job" className="hover:text-blue-600 transition">
            🔹 Tạo tin tuyển dụng
          </Link>

          <Link to="/recruiter/manage-jobs" className="hover:text-blue-600 transition">
            🔹 Quản lý tin tuyển dụng
          </Link>

          <Link to="/recruiter/applicants" className="hover:text-blue-600 transition">
            🔹 Danh sách ứng viên
          </Link>

          <Link to="/recruiter/profile" className="hover:text-blue-600 transition">
            🔹 Hồ sơ nhà tuyển dụng
          </Link>

          <Link to="/recruiter/verification" className="hover:text-blue-600 transition">
            🔹 Xác thực nhà tuyển dụng
          </Link>
        </nav>
      </aside>

      {/* ================= CONTENT ================= */}
      <div className="flex-1 p-8 mt-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800">
            Dashboard nhà tuyển dụng
          </h1>
          <p className="text-gray-600 mt-2">
            Quản lý tuyển dụng nhanh chóng & hiệu quả
          </p>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow hover:-translate-y-1 transition">
            <h3 className="text-lg font-semibold text-gray-700">Tin đã đăng</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {stats.postedJobs}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:-translate-y-1 transition">
            <h3 className="text-lg font-semibold text-gray-700">Ứng viên mới</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {stats.newApplicants}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:-translate-y-1 transition">
            <h3 className="text-lg font-semibold text-gray-700">Đang chờ duyệt</h3>
            <p className="text-3xl font-bold text-orange-600 mt-2">
              {stats.pending}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow hover:-translate-y-1 transition">
            <h3 className="text-lg font-semibold text-gray-700">Đã tuyển</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {stats.accepted}
            </p>
          </div>
        </div>

        {/* ================= FEATURE CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <Link
            to="/recruiter/create-job"
            className="bg-white shadow-xl rounded-2xl p-8 hover:-translate-y-2 hover:shadow-2xl transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 p-4 rounded-xl">
                <FilePlus size={34} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold">Tạo tin tuyển dụng</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Đăng job mới trong vài giây.
            </p>
          </Link>

          <Link
            to="/recruiter/manage-jobs"
            className="bg-white shadow-xl rounded-2xl p-8 hover:-translate-y-2 hover:shadow-2xl transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-green-100 p-4 rounded-xl">
                <Briefcase size={34} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold">
                Quản lý tin tuyển dụng
              </h2>
            </div>
            <p className="text-gray-600 text-sm">
              Chỉnh sửa, cập nhật hoặc xoá job.
            </p>
          </Link>

          <Link
            to="/recruiter/applicants"
            className="bg-white shadow-xl rounded-2xl p-8 hover:-translate-y-2 hover:shadow-2xl transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-purple-100 p-4 rounded-xl">
                <Users size={34} className="text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold">Danh sách ứng viên</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Xem & lọc ứng viên theo job.
            </p>
          </Link>

          <Link
            to="/recruiter/applicants/manage"
            className="bg-white shadow-xl rounded-2xl p-8 hover:-translate-y-2 hover:shadow-2xl transition-all"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-orange-100 p-4 rounded-xl">
                <ListChecks size={34} className="text-orange-600" />
              </div>
              <h2 className="text-2xl font-semibold">Xử lý đơn ứng tuyển</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Duyệt / từ chối hồ sơ ứng viên.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
