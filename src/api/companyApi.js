import axios from "axios";

const API = import.meta.env.VITE_API_URL;

// Tạo instance
const http = axios.create({
  baseURL: `${API}/api`,   // → tất cả request sẽ đi vào /api/...
  withCredentials: false,   // ← CẦN TẮT, tránh lỗi CORS khi không dùng cookie
});

// Gắn token tự động
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ================================
// LẤY THÔNG TIN CÔNG TY
// ================================
export const getCompany = () => {
  return http.get("/company/profile");  
};

// ================================
// LƯU / UPDATE THÔNG TIN CÔNG TY
// ================================
export const saveCompany = (formData) => {
  return http.post("/company/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
