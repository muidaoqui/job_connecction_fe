import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Input,
  Select,
  Button,
  Card,
  Empty,
  Spin,
  Tag,
  message,
  Divider,
} from "antd";
import { SearchOutlined, SaveOutlined } from "@ant-design/icons";
import useSavedJobs from "../../hooks/useSavedJobs";


const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [locations, setLocations] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [limit, setLimit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [isSemanticSearch, setIsSemanticSearch] = useState(false);
  const { savedJobsMap, toggleSaveJob } = useSavedJobs();



  const VITE_API_URL = import.meta.env.VITE_API_URL;

  // ==============================
  // Auth check
  // ==============================
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [isLoggedIn, limit]);

  useEffect(() => {
    fetchFiltersData();
  }, []);

  // Debounce semantic search
  useEffect(() => {
    const t = setTimeout(() => {
      handleSemanticSearch();
    }, 500);
    return () => clearTimeout(t);
  }, [searchTerm, selectedLocation, selectedJobType]);

  // ==============================
  // Fetch jobs
  // ==============================
  const fetchJobs = async () => {
    const token = localStorage.getItem("token");
    if (!token) return fetchAllJobs();

    setLoading(true);
    try {
      const res = await axios.get(
        `${VITE_API_URL}/api/embeddings/recommendations/jobs?limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.needsProfile) {
        setNeedsProfile(true);
        fetchAllJobs();
      } else {
        setJobs(res.data.data?.jobs || []);
        setHasMore(res.data.data?.jobs?.length === limit);
        setNeedsProfile(false);
        setIsSemanticSearch(false);
      }
    } catch {
      setNeedsProfile(true);
      fetchAllJobs();
    } finally {
      setLoading(false);
    }
  };

  const fetchAllJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${VITE_API_URL}/api/jobs`);
      const list = res.data?.data || [];
      setJobs(list.slice(0, limit));
      setHasMore(list.length > limit);
      setIsSemanticSearch(false);
    } catch {
      message.error("Không lấy được danh sách công việc");
    } finally {
      setLoading(false);
    }
  };

  const fetchFiltersData = async () => {
    try {
      const res = await axios.get(`${VITE_API_URL}/api/jobs`);
      const list = res.data?.data || [];
      setLocations([...new Set(list.map(j => j.location).filter(Boolean))]);
      setJobTypes([...new Set(list.map(j => j.jobType).filter(Boolean))]);
    } catch { }
  };

  // ==============================
  // Semantic search
  // ==============================
  const handleSemanticSearch = async () => {
    if (!searchTerm && !selectedLocation && !selectedJobType) {
      fetchJobs();
      return;
    }

    setLoading(true);
    try {
      const query = [searchTerm, selectedLocation, selectedJobType]
        .filter(Boolean)
        .join(" ");

      const res = await axios.post(
        `${VITE_API_URL}/api/embeddings/job/search`,
        { query, limit, numCandidates: 100 }
      );

      setJobs(res.data.data?.jobs || []);
      setHasMore(false);
      setIsSemanticSearch(true);
      setNeedsProfile(false);
    } catch {
      message.error("Lỗi tìm kiếm công việc");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (jobId) => {
    const token = localStorage.getItem("token");
    if (!token) return message.warning("Bạn cần đăng nhập");

    // Đã lưu rồi → không gọi API nữa
    if (savedJobIds.has(jobId)) {
      return message.info("Công việc đã được lưu");
    }

    try {
      await axios.post(
        `${VITE_API_URL}/api/jobs/${jobId}/save`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success("Đã lưu công việc!");

      setSavedJobIds(prev => new Set(prev).add(jobId));
    } catch (err) {
      message.error(err.response?.data?.message || "Lỗi khi lưu công việc");
    }
  };

  const fetchSavedJobs = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get(
        `${VITE_API_URL}/api/candidate/saved-jobs`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const ids = res.data?.data?.map(j => j.jobId?._id || j.jobId) || [];
      setSavedJobIds(new Set(ids));
    } catch (err) {
      console.error("Lỗi lấy saved jobs", err);
    }
  };


  return (
    <div className="container mx-auto px-6 py-8 bg-gray-50 min-h-screen">
      {/* Title */}
      <h1 className="text-3xl font-bold text-blue-600 mb-2">
        {isSemanticSearch
          ? "🔍 Kết quả tìm kiếm thông minh"
          : needsProfile
            ? "Tìm kiếm công việc"
            : isLoggedIn
              ? "✨ Công việc gợi ý cho bạn"
              : "Tìm kiếm công việc"}
      </h1>

      <p className="text-gray-600 mb-6">
        Khám phá hàng ngàn cơ hội việc làm phù hợp với bạn
      </p>

      {/* Profile notice */}
      {needsProfile && isLoggedIn && (
        <Card className="mb-6 bg-yellow-50 border-yellow-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-yellow-700">
                📝 Hoàn thiện hồ sơ để nhận gợi ý tốt hơn
              </h3>
              <p className="text-sm text-gray-600">
                Thêm kỹ năng & kinh nghiệm để AI gợi ý chính xác
              </p>
            </div>
            <Button
              type="primary"
              className="bg-yellow-600"
              onClick={() => (window.location.href = "/customer/mysaramin")}
            >
              Cập nhật hồ sơ
            </Button>
          </div>
        </Card>
      )}

      {/* Filters */}
      <Card className="mb-6 shadow">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <Input
              size="large"
              placeholder="VD: Backend Developer, Data Engineer..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select
            size="large"
            allowClear
            placeholder="Địa điểm"
            value={selectedLocation || undefined}
            onChange={(v) => setSelectedLocation(v || "")}
            options={locations.map(l => ({ label: l, value: l }))}
          />

          <Select
            size="large"
            allowClear
            placeholder="Loại công việc"
            value={selectedJobType || undefined}
            onChange={(v) => setSelectedJobType(v || "")}
            options={jobTypes.map(t => ({ label: t, value: t }))}
          />
        </div>

        {isSemanticSearch && (
          <div className="mt-3 text-sm text-blue-600">
            🤖 Đang sử dụng AI Semantic Search
          </div>
        )}
      </Card>

      {/* Results */}
      {loading && jobs.length === 0 ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : jobs.length === 0 ? (
        <Empty description="Không tìm thấy công việc phù hợp" />
      ) : (
        <>
          <div className="text-gray-600 mb-4">
            Tìm thấy <strong>{jobs.length}</strong> công việc
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <Card
                key={job._id}
                hoverable
                onClick={() => (window.location.href = `/job/${job._id}`)}
              >
                <div className="flex justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-blue-600">
                        {job.title}
                      </h3>
                      {job.saveCount > 50 && <Tag color="red">HOT</Tag>}
                      {job.score && (
                        <Tag color="green">
                          {Math.round(job.score * 100)}% phù hợp
                        </Tag>
                      )}
                    </div>

                    <p className="font-semibold text-gray-700 mt-1">
                      {job.companyId?.name}
                    </p>

                    <div className="text-sm text-gray-600 flex gap-4 mt-2">
                      <span>📍 {job.location}</span>
                      <span>💰 {job.salary || "Thương lượng"}</span>
                      <span>📋 {job.jobType}</span>
                    </div>

                    <p className="mt-2 text-gray-700 line-clamp-2">
                      {job.description}
                    </p>
                  </div>

                  <div
                    className="flex flex-col gap-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      type="primary"
                      onClick={() =>
                        (window.location.href = `/job/${job._id}`)
                      }
                    >
                      Xem chi tiết
                    </Button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveJob(job._id);
                      }}
                      className={`px-3 py-1 rounded-lg text-sm transition ${savedJobsMap[job._id]
                        ? "bg-red-100 text-red-600"
                        : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {savedJobsMap[job._id] ? "❤️ Đã Lưu" : "🤍 Lưu"}
                    </button>


                  </div>
                </div>
              </Card>
            ))}
          </div>

          {hasMore && !isSemanticSearch && (
            <div className="flex justify-center mt-8">
              <Button
                size="large"
                type="primary"
                loading={loading}
                onClick={() => setLimit((l) => l + 10)}
              >
                Xem thêm
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobSearch;
