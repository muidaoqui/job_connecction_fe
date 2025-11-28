import { useState } from "react";
import axios from "axios";

export default function CreateJob() {
  const user = JSON.parse(localStorage.getItem("user")); // Lấy recruiter ID

  const [form, setForm] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!user?._id) {
      alert("Không tìm thấy recruiterId!");
      return;
    }

    const jobData = {
      ...form,
      recruiterId: user._id,   // 💥 FIX QUAN TRỌNG
    };

    try {
      await axios.post("http://localhost:8080/api/jobs", jobData);
      alert("Tạo tin tuyển dụng thành công!");
    } catch (err) {
      console.log(err);
      alert("Không thể kết nối BE!");
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
              placeholder="VD: Frontend Developer"
              onChange={handleChange}
              className="w-full border border-slate-300 p-3 rounded-lg mt-1"
            />
          </div>

          <div>
            <label className="font-semibold">Mô tả</label>
            <textarea
              name="description"
              placeholder="Mô tả chi tiết công việc..."
              className="w-full border border-slate-300 p-3 rounded-lg mt-1 h-28"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="font-semibold">Yêu cầu</label>
            <textarea
              name="requirements"
              placeholder="Yêu cầu về kỹ năng, kinh nghiệm..."
              className="w-full border border-slate-300 p-3 rounded-lg mt-1 h-28"
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-semibold">Lương</label>
              <input
                name="salary"
                placeholder="VD: 15 - 25 triệu"
                className="w-full border border-slate-300 p-3 rounded-lg mt-1"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="font-semibold">Địa điểm</label>
              <input
                name="location"
                placeholder="VD: Hồ Chí Minh"
                className="w-full border border-slate-300 p-3 rounded-lg mt-1"
                onChange={handleChange}
              />
            </div>
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
