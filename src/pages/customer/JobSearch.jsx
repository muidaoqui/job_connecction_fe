import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Select, Button, Card, Empty, Spin, Tag, message } from "antd";
import { SearchOutlined, SaveOutlined } from "@ant-design/icons";

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [locations, setLocations] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchJobs();
  }, []);

  // ================================================
  // Lấy tất cả job
  // ================================================
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${VITE_API_URL}/api/jobs`);

      const jobList = res.data || [];

      setJobs(jobList);
      setFilteredJobs(jobList);

      // Tạo danh sách lọc location + jobType
      const uniqueLocations = [...new Set(jobList.map(j => j.location).filter(Boolean))];
      const uniqueJobTypes = [...new Set(jobList.map(j => j.jobType).filter(Boolean))];

      setLocations(uniqueLocations);
      setJobTypes(uniqueJobTypes);

    } catch (err) {
      console.error("Lỗi khi lấy jobs:", err);
      message.error("Không lấy được danh sách công việc!");
    } finally {
      setLoading(false);
    }
  };

  // ================================================
  // Search + Filter
  // ================================================
  const handleSearch = () => {
    let filtered = jobs;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(job =>
        job.title?.toLowerCase().includes(term) ||
        job.description?.toLowerCase().includes(term) ||
        job.companyId?.name?.toLowerCase().includes(term)
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(job => job.location === selectedLocation);
    }

    if (selectedJobType) {
      filtered = filtered.filter(job => job.jobType === selectedJobType);
    }

    // Sort theo số lượt save
    filtered = filtered.sort((a, b) => (b.saveCount || 0) - (a.saveCount || 0));

    setFilteredJobs(filtered);
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
      fetchJobs(); // reload danh sách để cập nhật saveCount

    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Lỗi khi lưu công việc");
    }
  };

  return (
    <div className="container mx-auto px-6 py-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Tìm Kiếm Công Việc</h1>

      {/* Bộ lọc */}
      <Card className="mb-6 shadow-md">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Tên công việc</label>
            <Input
              placeholder="VD: Developer, Manager..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={handleSearch}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Địa điểm</label>
            <Select
              placeholder="Chọn địa điểm"
              allowClear
              value={selectedLocation || undefined}
              onChange={(val) => setSelectedLocation(val || "")}
              options={locations.map(loc => ({ label: loc, value: loc }))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Loại công việc</label>
            <Select
              placeholder="Chọn loại"
              allowClear
              value={selectedJobType || undefined}
              onChange={(val) => setSelectedJobType(val || "")}
              options={jobTypes.map(type => ({ label: type, value: type }))}
            />
          </div>

          <div className="flex items-end">
            <Button
              type="primary"
              size="large"
              onClick={handleSearch}
              className="w-full bg-blue-600"
            >
              Tìm Kiếm
            </Button>
          </div>
        </div>
      </Card>

      {/* Kết quả */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <Empty description="Không tìm thấy công việc phù hợp" />
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job._id} className="hover:shadow-lg transition cursor-pointer">
              <div className="flex justify-between items-start">
                <div className="flex-1">

                  {/* Title */}
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-blue-600">{job.title}</h3>
                    {job.saveCount > 50 && <Tag color="red">🔥 HOT</Tag>}
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
                      {new Date(job.createdAt).toLocaleDateString()}
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
                    onClick={() => handleSave(job._id)}
                  >
                    Lưu
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobSearch;
