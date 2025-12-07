import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Tag, Spin, Empty, message, Divider, Modal, Input, Radio, Upload, Space, Row, Col, Badge } from "antd";
import { SaveOutlined, HeartOutlined, ShareAltOutlined, ArrowLeftOutlined, UploadOutlined, LinkOutlined } from "@ant-design/icons";
import { openProtectedFile } from "../../utils/fileHelpers";
import { useResumeManagement } from "../../hooks/useResumeManagement";
import { getProfile } from "../../api/profileAPI";

const JobDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { id: jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recruiter, setRecruiter] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [otherJobs, setOtherJobs] = useState([]);
  const { resumes, uploadNewResume, loading: resumesLoading, fetchResumes } = useResumeManagement();
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [newCvFile, setNewCvFile] = useState(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [coverMessage, setCoverMessage] = useState("");
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchJobDetail();
  }, [jobId]);

  const fetchJobDetail = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${VITE_API_URL}/api/jobs/${jobId}`);
      if (res.data?.job) {
        setJob(res.data.job);
        // Fetch recruiter info if available
        if (res.data.job.recruiterId?._id) {
          try {
            const recruiterRes = await axios.get(
              `${VITE_API_URL}/api/company/${res.data.job.recruiterId._id}`
            );
            setRecruiter(recruiterRes.data?.recruiter);
          } catch (err) {
            console.log("Could not fetch recruiter details");
          }
        }
        // If user is logged in, check whether this job is already saved
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const checkRes = await axios.get(
              `${VITE_API_URL}/api/candidate/saved-jobs/check/${jobId}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (checkRes.data?.saved) setIsSaved(true);
          } catch (err) {
            console.log("Could not check saved status", err);
          }
        }

        // Fetch other jobs from same company
        if (res.data.job.companyId?._id) {
          try {
            const jobsRes = await axios.get(`${VITE_API_URL}/api/jobs`);
            const allJobs = jobsRes.data || [];
            const others = allJobs
              .filter((j) => j.companyId?._id === res.data.job.companyId._id && j._id !== jobId)
              .slice(0, 4);
            setOtherJobs(others);
          } catch (err) {
            console.log("Could not fetch other jobs");
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
      const token = localStorage.getItem("token");
      if (!token) {
        message.warning("Vui lòng đăng nhập để lưu công việc");
        window.location.href = "/login";
        return;
      }

      if (isSaved) {
        // Unsave
        await axios.post(`${VITE_API_URL}/api/jobs/${jobId}/unsave`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsSaved(false);
        message.success("Đã bỏ lưu công việc");
      } else {
        // Save
        await axios.post(`${VITE_API_URL}/api/jobs/${jobId}/save`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsSaved(true);
        message.success("Đã lưu công việc");
      }
    } catch (err) {
      console.error("Save job error:", err);
      message.error("Lỗi khi lưu công việc");
    }
  };

  const openApplyModal = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const profileRes = await getProfile();
        const profile = profileRes.data;
        setApplicantName(profile?.name || "");
        setApplicantEmail(profile?.user?.email || profile?.email || profile?.userId?.email || "");
      }
    } catch (err) {
      // ignore
    }

    await fetchResumes();
    setSelectedResumeId((prev) => prev || (resumes && resumes[0] && resumes[0].id) || null);
    setShowApplyModal(true);
  };

  const handleApplySubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      message.error("Bạn cần đăng nhập để ứng tuyển");
      return;
    }

    const formData = new FormData();   // 🔥 KHÔNG để bên ngoài hàm

    formData.append("name", applicantName);
    formData.append("email", applicantEmail);
    formData.append("message", coverMessage);

    // ---- Xử lý CV ----
    if (newCvFile) {
      formData.append("cvFile", newCvFile);      // ✔ đúng field backend
    } else if (selectedResumeId) {
      const selected = resumes.find((r) => r.id === selectedResumeId);

      if (selected?.path) {
        const resp = await fetch(selected.path);
        const blob = await resp.blob();

        const file = new File([blob], selected.name || "resume.pdf", {
          type: "application/pdf"
        });


        formData.append("cvFile", file); // ✔ đúng field
      }
    }

    // ---------------------

    try {
      await axios.post(
        `http://localhost:8080/api/jobs/${jobId}/apply`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Ứng tuyển thành công!");
      alert("Ứng tuyển thành công!");
      setShowApplyModal(false);

    } catch (err) {
      console.error("ERR APPLY:", err.response?.data);
      alert("Ứng tuyển thất bại");
      message.error("Ứng tuyển thất bại");
    }
  };




  const company = job?.companyId || job?.recruiterId?.companyId || {};
  if (loading || !job) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }
  const companyName = company?.name || "Công ty";
  const companyLogo = company?.logo || "";

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button
          type="link"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="mb-4 text-blue-600 p-0"
        >
          Quay lại
        </Button>

        {/* Main Layout: 2-column */}
        <Row gutter={[24, 24]}>
          {/* Left Column: Main Content */}
          <Col xs={24} lg={16} className="space-y-4">
            {/* Job Header Card */}
            <Card className="shadow-md p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    {companyLogo && (
                      <div className="w-16 h-16 bg-white border border-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        <img src={companyLogo} alt={companyName} className="w-full h-full object-contain p-2" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-blue-600 mb-2">{job.title}</h1>
                      <div className="flex gap-2 flex-wrap mb-2">
                        {job.jobType && <Tag color="blue">{job.jobType}</Tag>}
                        {job.saveCount > 50 && <Tag color="red">🔥 HOT</Tag>}
                      </div>
                      <p className="text-gray-700 font-semibold">{companyName}</p>
                      <div className="text-xs text-gray-500 mt-2 space-y-1">
                        <p>📍 {job.location || "Chưa rõ"}</p>
                        <p>💰 {job.salary || "Thương lượng"}</p>
                        <p>⏰ Hạn nộp: {job.deadline ? new Date(job.deadline).toLocaleDateString("vi-VN") : "Không rõ"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <Button
                    type="primary"
                    size="large"
                    className="bg-blue-600 hover:bg-blue-700 mb-2 w-32"
                    onClick={openApplyModal}
                  >
                    Ứng Tuyển
                  </Button>
                  <Button
                    size="large"
                    block
                    icon={<SaveOutlined />}
                    type={isSaved ? "primary" : "default"}
                    className={isSaved ? "bg-blue-600 hover:bg-blue-700 mb-2" : "border-blue-500 text-blue-500"}
                    onClick={handleSaveJob}
                  >
                    {isSaved ? "Đã Lưu" : "Lưu"}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Company Banner / Image */}
            {company?.backgroundImage && (
              <Card className="shadow-md p-0 overflow-hidden">
                <img src={company.backgroundImage} alt="company" className="w-full h-48 object-cover" />
              </Card>
            )}

            {/* Job Description */}
            <Card className="shadow-md p-6">
              <h2 className="text-xl font-bold text-green-700 mb-4">MÔ TẢ CÔNG VIỆC</h2>
              <div className="text-gray-700 whitespace-pre-wrap mb-6">{job.description || "Chưa có mô tả"}</div>

              <h2 className="text-xl font-bold text-green-700 mb-4">TRÁCH NHIỆM</h2>
              <div className="text-gray-700 whitespace-pre-wrap mb-6">{job.responsibilities || job.description || "Chưa có thông tin"}</div>

              <h2 className="text-xl font-bold text-green-700 mb-4">YÊU CẦU</h2>
              <div className="text-gray-700 whitespace-pre-wrap">{job.requirements || "Chưa có thông tin"}</div>
            </Card>
          </Col>

          {/* Right Column: Sidebar */}
          <Col xs={24} lg={8}>
            {/* Salary Card */}
            <Card className="shadow-md mb-4 text-center py-6 bg-gradient-to-b from-green-50 to-white">
              <div className="text-3xl font-bold text-green-700 mb-2">{job.salary || "Thương lượng"}</div>
              <p className="text-sm text-gray-600">Mức lương</p>
            </Card>

            {/* Company Info Card */}
            {company && (
              <Card className="shadow-md mb-4">
                <div className="text-center">
                  {companyLogo && (
                    <div className="flex justify-center mb-4">
                      <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center border border-gray-200">
                        <img src={companyLogo} alt={companyName} className="w-full h-full object-contain p-2" />
                      </div>
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-blue-600 mb-2">{companyName}</h3>
                  <p className="text-sm text-gray-600 mb-3">{company.industry || "Ngành nghề"}</p>
                  <div className="text-sm text-gray-600 mb-4">
                    <p>👥 Hơn {company.size || 100} nhân viên</p>
                  </div>
                  <Button
                    block
                    type="primary"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate(`/company/${company._id}`)}
                  >
                    Xem chi tiết công ty
                  </Button>
                </div>
              </Card>
            )}

            {/* Other Jobs from Company */}
            {otherJobs.length > 0 && (
              <Card className="shadow-md">
                <h3 className="text-lg font-bold text-blue-600 mb-4">
                  {otherJobs.length} việc làm khác tại công ty này
                </h3>
                <div className="space-y-3">
                  {otherJobs.map((j) => (
                    <div
                      key={j._id}
                      className="p-3 border rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
                      onClick={() => navigate(`/job/${j._id}`)}
                    >
                      <p className="font-semibold text-blue-600 text-sm line-clamp-2 hover:underline">
                        {j.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">📍 {j.location || "Chưa rõ"}</p>
                      <p className="text-xs text-gray-600">💰 {j.salary || "Thương lượng"}</p>
                      <Button
                        type="primary"
                        size="small"
                        block
                        className="bg-blue-600 hover:bg-blue-700 mt-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/job/${j._id}`;
                        }}
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  ))}
                </div>
                {otherJobs.length > 0 && (
                  <Button
                    block
                    type="link"
                    className="text-blue-600 mt-3"
                    onClick={() => navigate(`/company/${company._id}`)}
                  >
                    Xem thêm việc làm →
                  </Button>
                )}
              </Card>
            )}

            {/* Recruiter / Contact Info */}
            {recruiter && (
              <Card className="shadow-md">
                <h3 className="text-lg font-bold text-blue-600 mb-4">👤 Liên Hệ Tuyển Dụng</h3>
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-3">
                    {recruiter.userId?.name?.charAt(0).toUpperCase() || 'R'}
                  </div>
                  <p className="font-semibold text-base text-gray-800">{recruiter.userId?.name || "Nhà tuyển dụng"}</p>
                  {recruiter.position && (
                    <p className="text-sm text-gray-600 mt-1">{recruiter.position}</p>
                  )}
                  {recruiter.companyId && (
                    <p className="text-sm font-semibold text-blue-600 mt-2">{recruiter.companyId.name}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">👥 {recruiter.followers || 0} người theo dõi</p>
                  {recruiter.userId?.email && (
                    <p className="text-xs text-gray-600 mt-2 break-all">
                      📧 {recruiter.userId.email}
                    </p>
                  )}
                  <Button
                    type="primary"
                    block
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                    onClick={() => message.info("Chức năng theo dõi sẽ được cập nhật")}
                  >
                    Theo Dõi
                  </Button>
                </div>
              </Card>
            )}
          </Col>
        </Row>

        {/* Candidates Supporters Section - Full Width Below */}
        <Row gutter={[24, 24]} className="mt-8">
          <Col xs={24}>
            <Card className="shadow-md bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-l-purple-500">
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">✨</div>
                <h3 className="text-lg font-bold text-purple-700">Ứng viên được hỗ trợ</h3>
              </div>
              <p className="text-sm text-gray-600">
                Công ty này ưu tiên hỗ trợ các ứng viên có kinh nghiệm phù hợp. Hãy chuẩn bị CV chi tiết và cover letter thuyết phục để tăng cơ hội nhận được phản hồi nhanh chóng.
              </p>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Apply Modal */}
      <Modal
        title={`Ứng tuyển: ${job?.title || ""}`}
        open={showApplyModal}
        onCancel={() => setShowApplyModal(false)}
        onOk={handleApplySubmit}
        confirmLoading={applyLoading}
        width={760}
        okText="Gửi đơn ứng tuyển"
        cancelText="Hủy"
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-semibold text-sm">Họ và tên</label>
            <Input
              placeholder="Nhập họ và tên"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-sm">Email</label>
            <Input
              type="email"
              placeholder="Nhập email"
              value={applicantEmail}
              onChange={(e) => setApplicantEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-sm">Chọn hoặc tải lên CV</label>
            {resumes && resumes.length > 0 ? (
              <Radio.Group
                value={selectedResumeId}
                onChange={(e) => {
                  setSelectedResumeId(e.target.value);
                  setNewCvFile(null);
                }}
                className="w-full mb-3"
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  {resumes.map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-blue-50">
                      <Radio value={r.id}>
                        {r.name} {r.isMain && <Tag color="blue">CV chính</Tag>}
                      </Radio>
                      <div>
                        {r.path && (
                          <Button
                            type="link"
                            size="small"
                            onClick={() => openProtectedFile(r.path, false)}
                          >
                            Xem
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </Space>
              </Radio.Group>
            ) : (
              <p className="text-sm text-gray-500 mb-3">Chưa có CV nào</p>
            )}

            <Upload
              beforeUpload={() => false}
              onChange={(info) => {
                setNewCvFile(info.file);
                setSelectedResumeId(null);
              }}
              accept=".pdf,.doc,.docx"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />} block>Tải CV mới lên</Button>
            </Upload>
            <p className="text-xs text-gray-500 mt-2">Hỗ trợ .doc, .docx, .pdf và ≤5MB. Nếu tải lên CV mới sẽ ghi đè lựa chọn trên.</p>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-sm">Cover Letter / Lời nhắn (tùy chọn)</label>
            <Input.TextArea
              rows={5}
              placeholder="Giới thiệu về bản thân hoặc lý do ứng tuyển..."
              value={coverMessage}
              onChange={(e) => setCoverMessage(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobDetail;


