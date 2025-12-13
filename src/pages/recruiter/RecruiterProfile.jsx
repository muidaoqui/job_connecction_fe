import React, { useState, useEffect } from "react";
import axios from "axios";

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
    companyId: "", // 🔥 QUAN TRỌNG
  });

  /* ================= LOAD PROFILE ================= */
  const token = localStorage.getItem("token");

   useEffect(() => {
  fetchRecruiterProfile();

  if (!token) return;

  fetchCompany();
}, [token]);
 

  const fetchRecruiterProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/recruiter/profile/me",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data?.data) {
        const data = res.data.data;

        setForm({
          fullName: data.name || "",
          position: data.position || "",
          phone: data.phone || "",
          workEmail: data.workEmail || "",
          bio: data.bio || "",
          companyId: data.companyId || "",
        });

        if (data.avatar) {
          setAvatarPreview(data.avatar);
        }
      }
    } catch (err) {
      console.log("Recruiter chưa có hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOAD COMPANY ================= */
  const fetchCompany = async () => {
  try {
    const res = await axios.get(
      "http://localhost:8080/api/company/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("👉 COMPANY PROFILE:", res.data.data); // 👈 DEBUG

    if (res.data?.data?._id) {
      setForm((prev) => ({
        ...prev,
        companyId: res.data.data._id,
      }));
    }
  } catch (err) {
    console.log("Chưa có company");
  }
};

  /* ================= HANDLERS ================= */
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  /* ================= SUBMIT ================= */
  const onSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("fullName", form.fullName);
      formData.append("position", form.position);
      formData.append("phone", form.phone);
      formData.append("workEmail", form.workEmail);
      formData.append("bio", form.bio);

      // 🔥 QUAN TRỌNG: GỬI companyId
      if (form.companyId) {
        formData.append("companyId", form.companyId);
      }

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await axios.post(
        "http://localhost:8080/api/recruiter/profile/me",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("✅ Lưu hồ sơ nhà tuyển dụng thành công!");
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi lưu hồ sơ!");
    }
  };

  /* ================= UI ================= */
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
          <input type="file" onChange={onAvatarChange} accept="image/*" />
        </div>
      </div>

      {/* Form */}
      <div className="space-y-5">
        <input
          name="fullName"
          value={form.fullName}
          onChange={onChange}
          className="w-full p-3 border rounded-lg"
          placeholder="Họ và tên"
        />

        <input
          name="position"
          value={form.position}
          onChange={onChange}
          className="w-full p-3 border rounded-lg"
          placeholder="Chức vụ"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={onChange}
          className="w-full p-3 border rounded-lg"
          placeholder="Số điện thoại"
        />

        <input
          name="workEmail"
          value={form.workEmail}
          onChange={onChange}
          className="w-full p-3 border rounded-lg"
          placeholder="Email công việc"
        />

        <textarea
          name="bio"
          value={form.bio}
          onChange={onChange}
          className="w-full p-3 border rounded-lg h-32"
          placeholder="Giới thiệu bản thân"
        />

        <button
          onClick={onSubmit}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold"
        >
          Lưu hồ sơ
        </button>
      </div>
    </div>
  );
}
