import axios from "axios";


const API = import.meta.env.VITE_API_URL;
const instance = axios.create({
  baseURL: `${API}/api`, // sửa nếu backend port khác
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
