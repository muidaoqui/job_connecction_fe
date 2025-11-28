import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Select, Button, Card, Empty, Spin, Tag } from "antd";
import { SearchOutlined, SaveOutlined, HeartOutlined } from "@ant-design/icons";

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [locations, setLocations] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/jobs");
      setJobs(res.data || []);
      setFilteredJobs(res.data || []);

      // Extract unique locations and job types
      const uniqueLocations = [...new Set((res.data || []).map(j => j.location).filter(Boolean))];
      const uniqueJobTypes = [...new Set((res.data || []).map(j => j.jobType).filter(Boolean))];
      setLocations(uniqueLocations);
      setJobTypes(uniqueJobTypes);
    } catch (err) {
      console.error("Lỗi khi lấy jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.companyId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedLocation) {
      filtered = filtered.filter(job => job.location === selectedLocation);
    }

    if (selectedJobType) {
      filtered = filtered.filter(job => job.jobType === selectedJobType);
    }

    setFilteredJobs(filtered.sort((a, b) => (b.saveCount || 0) - (a.saveCount || 0)));
  };

  return (
    <div className="container mx-auto px-6 py-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Tìm Kiếm Công Việc</h1>

      {/* Search Filters */}
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
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Tìm Kiếm
            </Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      {loading ? (
        <Spin />
      ) : filteredJobs.length === 0 ? (
        <Empty description="Không tìm thấy công việc phù hợp" />
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job._id} className="hover:shadow-lg transition cursor-pointer">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold text-blue-600">{job.title}</h3>
                    {job.saveCount > 50 && (
                      <Tag color="red">🔥 HOT</Tag>
                    )}
                  </div>

                  <p className="text-lg text-gray-700 font-semibold mt-2">
                    {job.companyId?.name || job.recruiterId?.name || "Nhà tuyển dụng"}
                  </p>

                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span>📍 {job.location || "Chưa rõ"}</span>
                    <span>💰 {job.salary || "Thương lượng"}</span>
                    {job.jobType && <span>📋 {job.jobType}</span>}
                  </div>

                  {job.companyId && (
                    <p className="text-xs text-gray-500 mt-2">
                      {job.companyId.industry && `${job.companyId.industry} • `}
                      {job.companyId.country && `${job.companyId.country}`}
                      {job.companyId.size && ` • ${job.companyId.size}`}
                    </p>
                  )}

                  <p className="text-gray-700 mt-3 line-clamp-2">{job.description}</p>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <div className="text-right">
                    <p className="text-sm text-blue-600 font-semibold">💾 {job.saveCount || 0} lượt lưu</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <Button
                    type="primary"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.location.href = `/customer/job/${job._id}`}
                  >
                    Xem Chi Tiết
                  </Button>

                  <Button
                    icon={<SaveOutlined />}
                    className="border-blue-500 text-blue-500 hover:text-blue-700 hover:border-blue-700"
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
