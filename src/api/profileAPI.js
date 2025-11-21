import axios from "axios";

const BASE_URL = "http://localhost:8080/api/candidate";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
};

const getAuthHeadersMultipart = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "multipart/form-data",
    },
  };
};

// Profile
export const getProfile = () =>
  axios.get(`${BASE_URL}`, getAuthHeaders());

export const createProfile = (data) =>
  axios.post(`${BASE_URL}`, data, getAuthHeaders());

export const updateProfile = (data) =>
  axios.put(`${BASE_URL}`, data, getAuthHeaders());

export const uploadResume = (formData) => {
  const token = localStorage.getItem("token");
  return axios.post(`${BASE_URL}/upload`, formData, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      // Let axios set Content-Type to multipart/form-data automatically
    },
  });
};

// List resume files saved on server
export const getResumes = () => axios.get(`${BASE_URL}/resumes`, getAuthHeaders());

// Set main resume
export const setMainResume = (mainResumePath) =>
  axios.put(`${BASE_URL}/main-resume`, { mainResumePath }, getAuthHeaders());

// Experience
export const getExperiences = () =>
  axios.get(`${BASE_URL}/experience`, getAuthHeaders());

export const createExperience = (data) =>
  axios.post(`${BASE_URL}/experience`, data, getAuthHeaders());

export const updateExperience = (id, data) =>
  axios.put(`${BASE_URL}/experience/${id}`, data, getAuthHeaders());

export const deleteExperience = (id) =>
  axios.delete(`${BASE_URL}/experience/${id}`, getAuthHeaders());

// Skills
export const getSkills = () =>
  axios.get(`${BASE_URL}/skill`, getAuthHeaders());

export const createSkill = (data) =>
  axios.post(`${BASE_URL}/skill`, data, getAuthHeaders());

export const updateSkill = (id, data) =>
  axios.put(`${BASE_URL}/skill/${id}`, data, getAuthHeaders());

export const deleteSkill = (id) =>
  axios.delete(`${BASE_URL}/skill/${id}`, getAuthHeaders());

export const endorseSkill = (id) =>
  axios.post(`${BASE_URL}/skill/${id}/endorse`, {}, getAuthHeaders());

// Education
export const getEducations = () =>
  axios.get(`${BASE_URL}/education`, getAuthHeaders());

export const createEducation = (data) =>
  axios.post(`${BASE_URL}/education`, data, getAuthHeaders());

export const updateEducation = (id, data) =>
  axios.put(`${BASE_URL}/education/${id}`, data, getAuthHeaders());

export const deleteEducation = (id) =>
  axios.delete(`${BASE_URL}/education/${id}`, getAuthHeaders());

// Projects
export const getProjects = () =>
  axios.get(`${BASE_URL}/project`, getAuthHeaders());

export const createProject = (data) =>
  axios.post(`${BASE_URL}/project`, data, getAuthHeaders());

export const updateProject = (id, data) =>
  axios.put(`${BASE_URL}/project/${id}`, data, getAuthHeaders());

export const deleteProject = (id) =>
  axios.delete(`${BASE_URL}/project/${id}`, getAuthHeaders());

// Applications
export const getApplications = () =>
  axios.get(`${BASE_URL}/applications`, getAuthHeaders());

export const applyJob = (data) =>
  axios.post(`${BASE_URL}/applications/apply`, data, getAuthHeaders());

export const withdrawApplication = (applicationId) =>
  axios.delete(`${BASE_URL}/applications/${applicationId}`, getAuthHeaders());

// Saved Jobs
export const getSavedJobs = () =>
  axios.get(`${BASE_URL}/saved-jobs`, getAuthHeaders());

export const saveJob = (data) =>
  axios.post(`${BASE_URL}/saved-jobs`, data, getAuthHeaders());

export const unsaveJob = (jobId) =>
  axios.delete(`${BASE_URL}/saved-jobs/${jobId}`, getAuthHeaders());

export const checkJobSaved = (jobId) =>
  axios.get(`${BASE_URL}/saved-jobs/check/${jobId}`, getAuthHeaders());

// Viewed Jobs
export const getViewedJobs = () =>
  axios.get(`${BASE_URL}/viewed-jobs`, getAuthHeaders());

export const recordJobView = (data) =>
  axios.post(`${BASE_URL}/viewed-jobs`, data, getAuthHeaders());

// Invitations
export const getInvitations = () =>
  axios.get(`${BASE_URL}/invitations`, getAuthHeaders());