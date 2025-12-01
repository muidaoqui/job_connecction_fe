import React, { useState, useEffect } from "react";
import axios from "../../services/axiosInstance";

export default function RecruiterProfile() {
  const [loading, setLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [form, setForm] = useState({
    fullName: "",
    position: "",
    phone: "",
    workEmail: "",
    bio: "",
  });

  // Load recruiter profile
  useEffect(() => {
    fetchRecruiterProfile();
  }, []);

  const fetchRecruiterProfile = async () => {
    try {
      const res = await axios.get("/recruiter/profile/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.data.success && res.data.data) {
        setForm(res.data.data);

        if (res.data.data.avatar) {
          setAvatarPreview(res.data.data.avatar);
        }
      }
    } catch (error) {
      console.log("Recruiter chưa có hồ sơ.");
    }
    setLoading(false);
  };

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = async () => {
    try {
      const res = await axios.post("/recruiter/profile/me", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      alert(res.data.message);
    } catch (err) {
      alert("Lỗi khi lưu hồ sơ!");
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 p-10 text-lg">
        Đang tải hồ sơ...
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-8 bg-white shadow-lg rounded-xl mx-auto max-w-4xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-3">
        Hồ sơ nhà tuyển dụng
      </h2>

      {/* Avatar */}
      <div className="flex items-center gap-6 mb-8">
        <img
          src={
            avatarPreview ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          }
          alt="avatar"
          className="w-24 h-24 rounded-full border object-cover"
        />

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Ảnh đại diện
          </label>
          <input
            type="file"
            onChange={onAvatarChange}
            className="text-sm"
            accept="image/*"
          />
        </div>
      </div>

      {/* Form */}
      <div className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Họ và tên *
          </label>
          <input
            name="fullName"
            value={form.fullName}
            onChange={onChange}
            className="w-full p-3 border rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="VD: Nguyễn Văn A"
          />
        </div>

        {/* Position */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Chức vụ *
          </label>
          <input
            name="position"
            value={form.position}
            onChange={onChange}
            className="w-full p-3 border rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="VD: HR Manager"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Số điện thoại *
          </label>
          <input
            name="phone"
            value={form.phone}
            onChange={onChange}
            className="w-full p-3 border rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="VD: 0909 999 999"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Email công việc *
          </label>
          <input
            name="workEmail"
            value={form.workEmail}
            onChange={onChange}
            className="w-full p-3 border rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="VD: hr@company.com"
            type="email"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            Giới thiệu bản thân *
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={onChange}
            className="w-full p-3 border rounded-lg shadow-sm h-32 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            placeholder="Giới thiệu ngắn về bạn và công việc HR..."
          />
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button
            onClick={onSubmit}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 font-semibold"
          >
            Lưu hồ sơ
          </button>
        </div>
      </div>
    </div>
  );
}
