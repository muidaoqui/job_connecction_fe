import axios from "axios";

const BASE_URL = "http://localhost:8080/api/candidate";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getProfile = () =>
  axios.get(`${BASE_URL}/profile`, getAuthHeaders());

export const createProfile = (data) =>
  axios.post(`${BASE_URL}/profile`, data, getAuthHeaders());

export const updateProfile = (data) =>
  axios.put(`${BASE_URL}/profile`, data, getAuthHeaders());

export const uploadResume = (formData) =>
  axios.post(`${BASE_URL}/upload`, formData, getAuthHeaders());
    