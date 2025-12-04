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
