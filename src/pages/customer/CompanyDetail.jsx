import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Empty, Spin, Tag } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

const CompanyDetail = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(false);

  const VITE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (companyId) fetchCompanyDetail();
  }, [companyId]);

  const fetchCompanyDetail = async () => {
    setLoading(true);
    try {
      /* ================= COMPANY ================= */
      const companyRes = await axios.get(
        `${VITE_API_URL}/api/company/${companyId}`
      );

      const companyData =
        companyRes.data?.company || companyRes.data?.data || null;

      setCompany(companyData);

      /* ================= JOBS ================= */
      const jobsRes = await axios.get(
        `${VITE_API_URL}/api/jobs?companyId=${companyId}`
      );

      const jobsData = Array.isArray(jobsRes.data?.data)
        ? jobsRes.data.data
        : [];

      setJobs(jobsData.slice(0, 6));

      /* ================= RECRUITERS ================= */
      const recruitersRes = await axios.get(
        `${VITE_API_URL}/api/recruiter?companyId=${companyId}`
      );

      const recruitersData = Array.isArray(recruitersRes.data?.recruiters)
        ? recruitersRes.data.recruiters
        : [];

      setRecruiters(recruitersData);
    } catch (error) {
      console.error("❌ Lỗi khi lấy chi tiết công ty:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  /* ================= NOT FOUND ================= */
  if (!company) {
    return (
      <div className="container mx-auto px-6 py-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          Quay lại
        </Button>
        <Empty description="Không tìm thấy công ty" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-6 bg-gray-50 min-h-screen">
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        Quay lại
      </Button>

      {/* ================= COMPANY HEADER ================= */}
      <Card className="mb-6 shadow-lg overflow-hidden" >
        {/* Banner */}
        {company.coverImage ? (
          <div
            className="w-full h-64 bg-cover bg-center rounded-lg mb-4"
            style={{ backgroundImage: `url(${company.coverImage})` }}
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
            <h1 className="text-4xl font-bold text-blue-600 mb-3">
              {company.name}
            </h1>

            {company.industry && (
              <Tag color="blue" className="mb-3">
                {company.industry}
              </Tag>
            )}

            <div className="grid grid-cols-3 gap-4 text-sm bg-gray-50 p-4 rounded">
              {company.country && (
                <div>
                  <span className="font-semibold text-gray-600">📍 Quốc gia</span>
                  <p>{company.country}</p>
                </div>
              )}
              {company.size && (
                <div>
                  <span className="font-semibold text-gray-600">👥 Quy mô</span>
                  <p>{company.size}</p>
                </div>
              )}
              {company.address && (
                <div>
                  <span className="font-semibold text-gray-600">📮 Địa chỉ</span>
                  <p>{company.address}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {company.description && (
          <div className="mt-6 pt-6 border-t">
            <h2 className="text-xl font-bold mb-3">Giới thiệu công ty</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {company.description}
            </p>
          </div>
        )}

        {/* Gallery */}
        {company.images?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Hình ảnh</h2>
            <div className="grid grid-cols-3 gap-4">
              {company.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${company.name}-${idx}`}
                  className="w-full h-48 object-cover rounded-lg border hover:shadow-lg transition"
                />
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* ================= JOBS ================= */}
      <Card className="mb-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">
          🔥 Công việc đang tuyển ({jobs.length})
        </h2>

        {jobs.length === 0 ? (
          <Empty description="Công ty chưa đăng công việc nào" />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {jobs.map(job => (
              <div
                key={job._id}
                onClick={() => navigate(`/job/${job._id}`)}
                className="border rounded-lg p-4 hover:shadow-md cursor-pointer transition"
              >
                <h3 className="text-lg font-semibold text-blue-600 mb-2">
                  {job.title}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>📍 {job.location}</p>
                  <p className="font-semibold text-blue-600">{job.salary}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(job.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ================= RECRUITERS ================= */}
      <Card className="shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-blue-600">
          👥 Nhân viên tuyển dụng ({recruiters.length})
        </h2>

        {recruiters.length === 0 ? (
          <Empty description="Chưa có nhân viên tuyển dụng" />
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {recruiters.map(rec => (
              <div
                key={rec._id}
                className="border rounded-lg p-4 text-center hover:shadow-md transition"
              >
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                  {rec.userId?.name?.charAt(0).toUpperCase() || "R"}
                </div>

                <h3 className="font-semibold text-blue-600">
                  {rec.userId?.name || "Recruiter"}
                </h3>

                {rec.position && (
                  <p className="text-xs text-gray-600 mb-2">
                    {rec.position}
                  </p>
                )}

                <p className="text-xs text-gray-500">
                  👥 {rec.followers || 0} theo dõi
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default CompanyDetail;
