import axios from "axios";

const API_URL = "http://localhost:8080/api/jobs";

export const searchJobs = async (params) => {
  return axios.get(API_URL, { params });
};

export const getJobById = async (id) => {
  return axios.get(`${API_URL}/${id}`);
};