import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Empty, Spin, Tag } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";

const CompanyDetail = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchCompanyDetail();
  }, [companyId]);

  const fetchCompanyDetail = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${VITE_API_URL}/api/company/${companyId}`);
      // Backend returns { success: true, company: {...} }
      const companyData = res.data.company || res.data;
      setCompany(companyData);

      // Fetch jobs posted by this company
      const jobsRes = await axios.get(`${VITE_API_URL}/api/jobs`);
      const companyJobs = (jobsRes.data || []).filter(job => {
        // Compare company ID - handle both string and ObjectId
        return job.companyId?._id === companyId || job.companyId === companyId;
      });
      setJobs(companyJobs.slice(0, 6)); // Show top 6 jobs

      // Fetch recruiters from this company
      const recruitersRes = await axios.get(`${VITE_API_URL}/api/recruiter`);
      const companyRecruiters = (recruitersRes.data?.recruiters || []).filter(
        recruiter => recruiter.companyId?._id === companyId || recruiter.companyId === companyId
      );
      setRecruiters(companyRecruiters);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết công ty:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin className="flex justify-center items-center h-screen" />;

  if (!company) {
    return (
      <div className="container mx-auto px-6 py-6">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => window.history.back()}
          className="mb-4"
        >
          Quay Lại
        </Button>
        <Empty description="Không tìm thấy công ty" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-6 bg-gray-50 min-h-screen">
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => window.history.back()}
        className="mb-6"
      >
        Quay Lại
      </Button>

      {/* Company Header */}
      <Card className="mb-6 shadow-lg overflow-hidden">
        {/* Hero Banner */}
        {company.backgroundImage ? (
          <div
            className="w-full h-64 bg-cover bg-center rounded-lg mb-4"
            style={{ backgroundImage: `url(${company.backgroundImage})` }}
          />
        ) : (
          <div className="w-full h-64 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg mb-4" />
        )}

        <div className="flex gap-8 items-start">
          {company.logo && (
            <img 
              src={company.logo} 
              alt={company.name}
              className="h-24 w-24 object-contain border border-gray-200 rounded-lg p-2"
            />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-blue-600 mb-3">{company.name}</h1>
            
            {company.industry && (
              <Tag color="blue" className="mb-3 text-sm">
                {company.industry}
              </Tag>
            )}

            <div className="grid grid-cols-3 gap-4 mb-4 text-sm bg-gray-50 p-4 rounded">
              {company.country && (
                <div>
                  <span className="font-semibold text-gray-600">📍 Quốc gia</span>
                  <p className="text-gray-800">{company.country}</p>
                </div>
              )}
              {company.size && (
                <div>
                  <span className="font-semibold text-gray-600">👥 Quy mô</span>
                  <p className="text-gray-800">{company.size}</p>
                </div>
              )}
              {company.address && (
                <div>
                  <span className="font-semibold text-gray-600">📮 Địa chỉ</span>
                  <p className="text-gray-800">{company.address}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {company.description && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h2 className="text-xl font-bold mb-3 text-gray-800">Giới Thiệu Công Ty</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{company.description}</p>
          </div>
        )}

        {/* Gallery */}
        {company.images && company.images.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Hình Ảnh</h2>
            <div className="grid grid-cols-3 gap-4">
              {company.images.map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  alt={`${company.name}-${idx}`} 
                  className="w-full h-48 object-cover rounded-lg border border-gray-200 hover:shadow-lg transition" 
                />
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Jobs Section */}
      <Card className="mb-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">
          🔥 Công Việc Đang Tuyển ({jobs.length})
        </h2>
        {jobs.length === 0 ? (
          <Empty description="Công ty này chưa đăng công việc nào" />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {jobs.map((job) => (
              <div 
                key={job._id}
                onClick={() => window.location.href = `/customer/job/${job._id}`}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-blue-600 mb-2">{job.title}</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>📍 {job.location}</p>
                  <p className="text-blue-600 font-semibold">{job.salary}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recruiters Section */}
      <Card className="shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">
          👥 Nhân Viên Tuyển Dụng ({recruiters.length})
        </h2>
        {recruiters.length === 0 ? (
          <Empty description="Chưa có nhân viên tuyển dụng" />
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {recruiters.map((recruiter) => (
              <div 
                key={recruiter._id}
                className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition"
              >
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
                  {recruiter.userId?.name?.charAt(0).toUpperCase() || 'R'}
                </div>
                <h3 className="font-semibold text-blue-600 mb-1">{recruiter.userId?.name}</h3>
                {recruiter.position && (
                  <p className="text-xs text-gray-600 mb-2">{recruiter.position}</p>
                )}
                <p className="text-xs text-gray-500">👥 {recruiter.followers} theo dõi</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default CompanyDetail;
