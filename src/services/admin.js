// src/services/admin.service.js
import axios from "axios";

const API_URL = "http://localhost:8080/api/admin";

// Lấy token function
function getToken() {
  return localStorage.getItem("token");
}

/* ================================
   Lấy danh sách tất cả users
================================ */
export const getAllUsers = async () => {
  const token = getToken();

  const res = await axios.get(`${API_URL}/users`, {
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

  const res = await axios.get(`${API_URL}/users/${id}`, {
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
    `${API_URL}/users/${id}/toggle-status`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data; // trả về user sau khi update
};

export const getPendingRecruiters = async () => {
  const token = getToken();

  const res = await axios.get(`${API_URL}/recruiters/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data; // trả về danh sách recruiter pending
};

export const approveRecruiter = async (id) => {
  const token = getToken();

  const res = await axios.patch(
    `${API_URL}/recruiter/approve/${id}`,
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
    `${API_URL}/recruiter/reject/${id}`,
    { note }, // có thể gửi lý do từ chối
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.data;
};

/* ================================
   Từ chối tin tuyển dụng
================================ */
export const rejectJob = async (jobId) => {
  const token = getToken();

  const res = await axios.put(
    `${API_URL}/jobs/${jobId}/reject`,
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
    `${API_URL}/jobs/${jobId}/approve`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
