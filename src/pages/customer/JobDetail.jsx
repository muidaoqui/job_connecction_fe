import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, Button, Tag, Spin, Empty, message, Divider } from "antd";
import { SaveOutlined, HeartOutlined, ShareAltOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { openProtectedFile } from "../../utils/fileHelpers";

const JobDetail = () => {
  const params = useParams();
  const jobId = params.jobId || params.id;
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recruiter, setRecruiter] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchJobDetail();
  }, [jobId]);

  const fetchJobDetail = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/jobs/${jobId}`);
      if (res.data?.job) {
        setJob(res.data.job);
        // Fetch recruiter info if available
        if (res.data.job.recruiterId?._id) {
          try {
            const recruiterRes = await axios.get(
              `http://localhost:8080/api/recruiter/${res.data.job.recruiterId._id}`
            );
            setRecruiter(recruiterRes.data?.recruiter);
          } catch (err) {
            console.log("Could not fetch recruiter details");
          }
        }
      }
    } catch (err) {
      console.error("Lỗi khi lấy job detail:", err);
      message.error("Không thể tải thông tin công việc");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async () => {
    try {
      if (isSaved) {
        // Unsave
        await axios.post(`http://localhost:8080/api/jobs/${jobId}/unsave`);
        setIsSaved(false);
        message.success("Đã bỏ lưu công việc");
      } else {
        // Save
        await axios.post(`http://localhost:8080/api/jobs/${jobId}/save`);
        setIsSaved(true);
        message.success("Đã lưu công việc");
      }
      // Refresh job data
      fetchJobDetail();
    } catch (err) {
      message.error("Lỗi khi lưu công việc");
    }
  };

  const handleApply = () => {
    window.location.href = `/apply/${jobId}`;
  };

  if (loading) return <Spin />;
  if (!job) return <Empty description="Không tìm thấy công việc" />;

  return (
    <div className="container mx-auto px-6 py-6 bg-gray-50 min-h-screen">
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => window.history.back()}
        className="mb-4 text-blue-600"
      >
        Quay lại
      </Button>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-4">
          <Card className="shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold text-blue-600">{job.title}</h1>
                  {job.saveCount > 50 && (
                    <Tag color="red" className="text-sm">
                      🔥 HOT
                    </Tag>
                  )}
                </div>
                <p className="text-lg text-gray-600 mt-2">
                  {job.companyId?.name || job.recruiterId?.name || "Nhà tuyển dụng"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{job.salary || "Thương lượng"}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <Divider />

            {/* Company Info */}
            {job.companyId && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">Về Công Ty</h3>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
                  <div>
                    <p className="text-sm text-gray-600">Tên công ty</p>
                    <p className="font-semibold">{job.companyId.name}</p>
                  </div>
                  {job.companyId.industry && (
                    <div>
                      <p className="text-sm text-gray-600">Ngành nghề</p>
                      <p className="font-semibold">{job.companyId.industry}</p>
                    </div>
                  )}
                  {job.companyId.country && (
                    <div>
                      <p className="text-sm text-gray-600">Quốc gia</p>
                      <p className="font-semibold">{job.companyId.country}</p>
                    </div>
                  )}
                  {job.companyId.size && (
                    <div>
                      <p className="text-sm text-gray-600">Quy mô công ty</p>
                      <p className="font-semibold">{job.companyId.size}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Job Details */}
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">Thông Tin Công Việc</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Địa điểm:</span> {job.location || "Chưa rõ"}
                </p>
                {job.jobType && (
                  <p>
                    <span className="font-semibold">Loại công việc:</span> {job.jobType}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            {job.description && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">Mô Tả Công Việc</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && (
              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">Yêu Cầu</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{job.requirements}</p>
              </div>
            )}

            {/* Stats */}
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-gray-600">
                💾 <span className="font-semibold">{job.saveCount || 0}</span> người đã lưu công việc này
              </p>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="shadow-md sticky top-6">
            <div className="space-y-3">
              <Button
                type="primary"
                size="large"
                block
                className="bg-blue-600 hover:bg-blue-700 h-10"
                onClick={handleApply}
              >
                Ứng Tuyển Ngay
              </Button>

              <Button
                size="large"
                block
                icon={<SaveOutlined />}
                type={isSaved ? "primary" : "default"}
                className={isSaved ? "bg-blue-600 hover:bg-blue-700" : "border-blue-500 text-blue-500 hover:border-blue-700 hover:text-blue-700"}
                onClick={handleSaveJob}
              >
                {isSaved ? "Đã Lưu" : "Lưu Công Việc"}
              </Button>

              <Button
                size="large"
                block
                icon={<ShareAltOutlined />}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  message.success("Đã sao chép link");
                }}
              >
                Chia Sẻ
              </Button>
            </div>
          </Card>

          {/* Recruiter Info */}
          {recruiter && (
            <Card className="shadow-md">
              <h3 className="font-bold mb-3">Liên Hệ Tuyển Dụng</h3>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-3">
                  {recruiter.userId?.name?.charAt(0).toUpperCase() || 'R'}
                </div>
                <p className="font-semibold text-lg">{recruiter.userId?.name}</p>
                {recruiter.position && (
                  <p className="text-sm text-gray-600">{recruiter.position}</p>
                )}
                {recruiter.companyId && (
                  <p className="text-sm font-semibold text-blue-600 mt-2">{recruiter.companyId.name}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">👥 {recruiter.followers} người theo dõi</p>

                <Button
                  type="primary"
                  block
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={() => message.info("Follow recruiter functionality coming soon")}
                >
                  Theo Dõi
                </Button>

                {recruiter.userId?.email && (
                  <p className="text-xs text-gray-500 mt-3 break-all">
                    {recruiter.userId.email}
                  </p>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
