import { useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";

export default function useSavedJobs() {
  const API = import.meta.env.VITE_API_URL;

  const [savedJobsMap, setSavedJobsMap] = useState({});
  const [loadingSaved, setLoadingSaved] = useState(false);

  // Load saved jobs once
  useEffect(() => {
    const loadSavedJobs = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      setLoadingSaved(true);
      try {
        const res = await axios.get(`${API}/api/candidate/saved-jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const map = {};
        res.data.data.forEach((item) => {
          map[item.jobId._id] = true;
        });

        setSavedJobsMap(map);
      } catch (err) {
        console.error("Load saved jobs error", err);
      } finally {
        setLoadingSaved(false);
      }
    };

    loadSavedJobs();
  }, []);

  // Toggle save / unsave
  const toggleSaveJob = async (jobId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.warning("Vui lòng đăng nhập để lưu công việc");
      return;
    }

    const isSaved = savedJobsMap[jobId];

    try {
      if (isSaved) {
        await axios.post(
          `${API}/api/jobs/${jobId}/unsave`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success("Đã bỏ lưu công việc");
      } else {
        await axios.post(
          `${API}/api/jobs/${jobId}/save`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success("Đã lưu công việc");
      }

      // Optimistic update
      setSavedJobsMap((prev) => ({
        ...prev,
        [jobId]: !isSaved,
      }));
    } catch (err) {
      message.error("Lỗi khi lưu công việc");
    }
  };

  return {
    savedJobsMap,
    toggleSaveJob,
    loadingSaved,
  };
}
