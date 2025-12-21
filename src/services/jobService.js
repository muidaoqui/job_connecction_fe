import axios from "axios";
const API = import.meta.env.VITE_API_URL;
const API_URL = `${API}/api/jobs`;

export const searchJobs = async (params) => {
  return axios.get(API_URL, { params });
};

export const getJobById = async (id) => {
  return axios.get(`${API_URL}/${id}`);
};