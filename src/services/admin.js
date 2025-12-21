// src/services/admin.service.js
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api`;

// Lấy token function
function getToken() {
  return localStorage.getItem("token");
}

//================================
// User.jsx starts
//================================

/* ================================
   Lấy danh sách tất cả users
================================ */
export const getAllUsers = async () => {
  const token = getToken();

  const res = await axios.get(`${API_URL}/admin/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data; // trả về json
};

/* ================================
   Lấy user theo ID
================================ */
export const getUserById = async (id) => {
  const token = getToken();

  const res = await axios.get(`${API_URL}/admin/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

/* ================================
   Toggle trạng thái user (active ↔ banned)
================================ */
export const toggleUserStatus = async (id) => {
  const token = getToken();

  const res = await axios.patch(
    `${API_URL}/admin/users/${id}/toggle-status`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data; // trả về user sau khi update
};

//================================
// User.jsx ends
//================================

//================================
// Verification.jsx starts
//================================
export const getPendingRecruiters = async () => {
  const token = getToken();

  const res = await axios.get(`${API_URL}/admin/recruiters/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data; // trả về danh sách recruiter pending
};

export const approveRecruiter = async (id) => {
  const token = getToken();

  const res = await axios.patch(
    `${API_URL}/admin/recruiter/approve/${id}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data; // trả về recruiter đã update
};

export const rejectRecruiter = async (id, note) => {
  const token = getToken();

  const res = await axios.patch(
    `${API_URL}/admin/recruiter/reject/${id}`,
    { note }, // có thể gửi lý do từ chối
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
};

/* ================================
   Lấy trạng thái recruiter theo userId
================================ */
export const getRecruiterStatus = async (userId) => {
  const token = getToken();

  const res = await axios.get(`${API_URL}/admin/recruiter/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data; // trả về recruiter
};

export const submitRecruiterVerification = async (userId, values) => {
  const token = getToken();

  const formData = new FormData();
  formData.append("companyName", values.companyName);
  formData.append("taxCode", values.taxCode);
  formData.append("phone", values.phone);
  formData.append("address", values.address);

  if (values.website) {
    formData.append("website", values.website);
  }

  formData.append("businessLicense", values.businessLicense[0].originFileObj);
  formData.append("idCardFront", values.idCardFront[0].originFileObj);
  formData.append("idCardBack", values.idCardBack[0].originFileObj);

  const res = await axios.post(`${API_URL}/admin/verify/${userId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
//================================
// Verification.jsx ends
//================================

//================================
// Jobs.jsx starts
//================================
/* ================================
   Từ chối tin tuyển dụng
================================ */
export const rejectJob = async (jobId) => {
  const token = getToken();

  const res = await axios.put(
    `${API_URL}/admin/jobs/${jobId}/reject`,
    {}, // body rỗng
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data; // backend nên trả job đã update
};

/* ================================
   Lấy danh sách tin tuyển dụng (Admin)
================================ */
export const getAllJobs = async () => {
  const token = getToken();

  const res = await axios.get(`${API_URL}/jobs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
  // backend nên trả: { data: [...] }
};

/* ================================
   Duyệt tin tuyển dụng (Admin)
================================ */
export const approveJob = async (jobId) => {
  const token = getToken();

  const res = await axios.put(
    `${API_URL}/admin/jobs/${jobId}/approve`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

//================================
// Jobs.jsx ends
//================================
