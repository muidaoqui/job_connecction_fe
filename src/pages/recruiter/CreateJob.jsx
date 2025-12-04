import { useState } from "react";
import axios from "axios";

export default function CreateJob() {
  const user = JSON.parse(localStorage.getItem("user"));
  const company = JSON.parse(localStorage.getItem("company")); 
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "Full-time",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
  try {
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    if (!company?._id) {
      alert("Bạn chưa tạo hồ sơ công ty!");
      return;
    }

    const jobData = {
      ...form,
      companyId: company._id,     // 🔥 BẮT BUỘC, BE yêu cầu
      // recruiterId KHÔNG gửi, BE tự gán
      jobType: form.jobType || "Full-time",
    };

    const res = await axios.post(
      "http://localhost:8080/api/jobs",
      jobData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    alert("Đăng tin tuyển dụng thành công!");
    console.log("JOB CREATED:", res.data);

  } catch (err) {
    console.log(err);

    if (err.response?.status === 403) {
      alert("Bạn cần có hồ sơ Nhà tuyển dụng trước khi đăng tin.");
    } else if (err.response?.status === 401) {
      alert("Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.");
    } else {
      alert("Lỗi khi tạo job!");
    }
  }
};

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Tạo tin tuyển dụng
        </h1>

        <div className="space-y-4">
          <div>
            <label className="font-semibold">Tiêu đề</label>
            <input
              name="title"
              value={form.title}
              placeholder="VD: Backend Developer"
              onChange={handleChange}
              className="w-full border border-slate-300 p-3 rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="font-semibold">Mô tả</label>
            <textarea
              name="description"
              value={form.description}
              placeholder="Mô tả chi tiết công việc..."
              className="w-full border border-slate-300 p-3 rounded-lg mt-1 h-28"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="font-semibold">Yêu cầu</label>
            <textarea
              name="requirements"
              value={form.requirements}
              placeholder="Kinh nghiệm, kỹ năng..."
              className="w-full border border-slate-300 p-3 rounded-lg mt-1 h-28"
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Lương</label>
              <input
                name="salary"
                value={form.salary}
                placeholder="VD: 15 - 25 triệu"
                className="w-full border border-slate-300 p-3 rounded-lg mt-1"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="font-semibold">Địa điểm</label>
              <input
                name="location"
                value={form.location}
                placeholder="VD: Hồ Chí Minh"
                className="w-full border border-slate-300 p-3 rounded-lg mt-1"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="font-semibold">Hình thức làm việc</label>
            <select
              name="jobType"
              value={form.jobType}
              onChange={handleChange}
              className="w-full border border-slate-300 p-3 rounded-lg mt-1"
            >
              <option value="Full-time">Toàn thời gian</option>
              <option value="Part-time">Bán thời gian</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-lg font-semibold transition"
          >
            Đăng tin tuyển dụng
          </button>
        </div>
      </div>
    </div>
  );
}
