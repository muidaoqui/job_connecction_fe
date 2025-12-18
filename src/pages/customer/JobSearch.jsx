import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Select, Button, Card, Empty, Spin, Tag, message } from "antd";
import { SearchOutlined, SaveOutlined } from "@ant-design/icons";

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
  
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Fetch initial jobs (recommended or all)
  useEffect(() => {
    fetchJobs();
  }, [isLoggedIn, limit]);

  // Fetch all locations and job types for filters
  useEffect(() => {
    fetchFiltersData();
  }, []);

  // Auto search when filters change (debounced)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSemanticSearch();
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedLocation, selectedJobType]);

  // ================================================
  // Fetch recommended jobs or all jobs
  // ================================================
  const fetchJobs = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      // Not logged in → fetch all jobs
      await fetchAllJobs();
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `${VITE_API_URL}/api/embeddings/recommendations/jobs?limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.needsProfile) {
        setNeedsProfile(true);
        await fetchAllJobs(); // Fallback to all jobs
      } else {
        setNeedsProfile(false);
        setJobs(res.data.data?.jobs || []);
        setHasMore(res.data.data?.jobs?.length === limit);
        setIsSemanticSearch(false);
      }
    } catch (err) {
      console.error("Lỗi khi lấy recommended jobs:", err);
      if (err.response?.status === 404 || err.response?.status === 401) {
        setNeedsProfile(true);
        await fetchAllJobs();
      }
    } finally {
      setLoading(false);
    }
  };

  // ================================================
  // Fetch all jobs (fallback)
  // ================================================
  const fetchAllJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${VITE_API_URL}/api/jobs`);
      const jobList = res.data?.data || [];
      setJobs(jobList.slice(0, limit));
      setHasMore(jobList.length > limit);
      setNeedsProfile(false);
      setIsSemanticSearch(false);
    } catch (err) {
      console.error("Lỗi khi lấy jobs:", err);
      message.error("Không lấy được danh sách công việc!");
    } finally {
      setLoading(false);
    }
  };

  // ================================================
  // Fetch filters data (locations + job types)
  // ================================================
  const fetchFiltersData = async () => {
    try {
      const res = await axios.get(`${VITE_API_URL}/api/jobs`);
      const jobList = res.data || [];

      const uniqueLocations = [...new Set(jobList.map(j => j.location).filter(Boolean))];
      const uniqueJobTypes = [...new Set(jobList.map(j => j.jobType).filter(Boolean))];

      setLocations(uniqueLocations);
      setJobTypes(uniqueJobTypes);
    } catch (err) {
      console.error("Lỗi khi lấy filters:", err);
    }
  };

  // ================================================
  // Semantic Search (using vector search API)
  // ================================================
  const handleSemanticSearch = async () => {
    // If no search criteria, fetch recommended/all jobs
    if (!searchTerm.trim() && !selectedLocation && !selectedJobType) {
      fetchJobs();
      return;
    }

    setLoading(true);
    try {
      // Build query string
      let queryParts = [];
      if (searchTerm.trim()) queryParts.push(searchTerm.trim());
      if (selectedLocation) queryParts.push(selectedLocation);
      if (selectedJobType) queryParts.push(selectedJobType);

      const query = queryParts.join(" ");

      const res = await axios.post(
        `${VITE_API_URL}/api/embeddings/job/search`,
        {
          query,
          limit: limit,
          numCandidates: 100
        }
      );

      setJobs(res.data.data?.jobs || []);
      setHasMore(false); // Semantic search returns fixed results
      setIsSemanticSearch(true);
      setNeedsProfile(false);
    } catch (err) {
      console.error("Lỗi khi semantic search:", err);
      message.error("Lỗi khi tìm kiếm công việc");
    } finally {
      setLoading(false);
    }
  };

  // ================================================
  // Load More
  // ================================================
  const handleLoadMore = () => {
    setLimit((prevLimit) => prevLimit + 10);
  };

  // ================================================
  // Save Job
  // ================================================
  const handleSave = async (jobId) => {
    const token = localStorage.getItem("token");
    if (!token) return message.warning("Bạn cần đăng nhập trước!");

    try {
      await axios.post(
        `${VITE_API_URL}/api/jobs/${jobId}/save`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      message.success("Đã lưu công việc!");
      fetchJobs(); 
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Lỗi khi lưu công việc");
    }
  };

  return (
    <div className="container mx-auto px-6 py-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        {isSemanticSearch ? "🔍 Kết Quả Tìm Kiếm Thông Minh" : 
         needsProfile ? "Tìm Kiếm Công Việc" : 
         isLoggedIn ? "✨ Công Việc Gợi Ý Cho Bạn" : "Tìm Kiếm Công Việc"}
      </h1>

      {/* Profile completion notice */}
      {needsProfile && isLoggedIn && (
        <Card className="mb-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-4">
            <div className="text-4xl">📝</div>
            <div className="flex-1">
              <h3 className="font-bold text-yellow-700 mb-1">
                Hoàn thiện hồ sơ để nhận gợi ý công việc phù hợp
              </h3>
              <p className="text-sm text-gray-600">
                Cập nhật học vấn, kinh nghiệm và kỹ năng để hệ thống gợi ý những công việc tốt nhất cho bạn
              </p>
            </div>
            <Button
              type="primary"
              className="bg-yellow-600 hover:bg-yellow-700"
              onClick={() => window.location.href = "/customer/mysaramin"}
            >
              Cập Nhật Hồ Sơ
            </Button>
          </div>
        </Card>
      )}

      {/* Search Filters */}
      <Card className="mb-6 shadow-md">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-semibold mb-2">
              Tên công việc hoặc từ khóa
            </label>
            <Input
              placeholder="VD: Backend Developer, Senior Manager..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="large"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Hệ thống sẽ tự động tìm kiếm công việc phù hợp khi bạn nhập
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Địa điểm</label>
            <Select
              placeholder="Chọn địa điểm"
              allowClear
              size="large"
              value={selectedLocation || undefined}
              onChange={(val) => setSelectedLocation(val || "")}
              options={locations.map(loc => ({ label: loc, value: loc }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Loại công việc</label>
            <Select
              placeholder="Chọn loại"
              allowClear
              size="large"
              value={selectedJobType || undefined}
              onChange={(val) => setSelectedJobType(val || "")}
              options={jobTypes.map(type => ({ label: type, value: type }))}
              className="w-full"
            />
          </div>
        </div>

        {isSemanticSearch && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              🤖 <strong>Tìm kiếm thông minh:</strong> Hệ thống đang sử dụng AI để tìm các công việc phù hợp nhất với từ khóa của bạn
            </p>
          </div>
        )}
      </Card>

      {/* Results */}
      {loading && jobs.length === 0 ? (
        <div className="flex justify-center py-10">
          <Spin size="large" tip="Đang tìm kiếm công việc phù hợp..." />
        </div>
      ) : jobs.length === 0 ? (
        <Empty 
          description="Không tìm thấy công việc phù hợp" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button 
            type="primary" 
            onClick={() => {
              setSearchTerm("");
              setSelectedLocation("");
              setSelectedJobType("");
              fetchJobs();
            }}
          >
            Xem Tất Cả Công Việc
          </Button>
        </Empty>
      ) : (
        <>
          <div className="mb-4 text-gray-600">
            Tìm thấy <strong>{jobs.length}</strong> công việc
          </div>
          
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job._id} className="hover:shadow-lg transition cursor-pointer">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {/* Title with score */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl font-semibold text-blue-600">{job.title}</h3>
                      {job.saveCount > 50 && <Tag color="red">🔥 HOT</Tag>}
                      {job.score && (
                        <Tag color="green">
                          {Math.round(job.score * 100)}% phù hợp
                        </Tag>
                      )}
                    </div>

                    {/* Company */}
                    <p className="text-lg text-gray-700 font-semibold mt-2">
                      {job.companyId?.name || "Nhà tuyển dụng"}
                    </p>

                    {/* Info */}
                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                      <span>📍 {job.location || "Chưa rõ"}</span>
                      <span>💰 {job.salary || "Thương lượng"}</span>
                      <span>📋 {job.jobType || "Không rõ"}</span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mt-3 line-clamp-2">{job.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    <div className="text-right">
                      <p className="text-sm text-blue-600 font-semibold">
                        💾 {job.saveCount || 0} lượt lưu
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(job.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>

                    <Button
                      type="primary"
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => (window.location.href = `/job/${job._id}`)}
                    >
                      Xem Chi Tiết
                    </Button>

                    <Button
                      icon={<SaveOutlined />}
                      className="border-blue-500 text-blue-500 hover:text-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSave(job._id);
                      }}
                    >
                      Lưu
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && !isSemanticSearch && (
            <div className="flex justify-center mt-8">
              <Button
                type="primary"
                size="large"
                loading={loading}
                onClick={handleLoadMore}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Xem Thêm Công Việc
              </Button>
            </div>
          )}

          {isSemanticSearch && jobs.length > 0 && (
            <div className="text-center mt-8 p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-600">
                Đã hiển thị tất cả kết quả tìm kiếm phù hợp nhất
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobSearch;
