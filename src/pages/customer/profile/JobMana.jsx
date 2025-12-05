import React, { useState, useEffect } from "react";
import {
    Card,
    Row,
    Col,
    Button,
    Tabs,
    Input,
    Radio,
    Tag,
    Empty,
    Space,
    Spin,
    Upload,
    message,
} from "antd";
import {
    EyeOutlined,
    UploadOutlined,
    RightCircleOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import ProfileSidebar from "../../../components/customer/ProfileSidebar";
import { useNavigate } from "react-router-dom";
import { useResumeManagement } from "../../../hooks/useResumeManagement";
import { openProtectedFile } from "../../../utils/fileHelpers";
import {
    getApplications,
    getSavedJobs,
    getViewedJobs,
    withdrawApplication,
    unsaveJob,
    removeViewedJob,
    getProfile,
} from "../../../api/profileAPI";

const JobManagementSidebar = ({ profileData }) => (
    <ProfileSidebar userName={profileData?.name} />
);

const SERVER_BASE = `${import.meta.env.VITE_API_URL}`;

const ContentLoiMoiUngTuyen = ({ selectedResume, setSelectedResume, resumes, profileData, onUpload, uploading, onSelectMain }) => {
    return (
        <div className="space-y-6">
            <Card className="shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                    Chọn CV Chính Của Bạn Để Hiển Thị Cho Nhà Tuyển Dụng
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                    Chọn CV hoàn chỉnh nhất để cung cấp thông tin đầy đủ cho Nhà Tuyển Dụng.
                </p>

                <h4 className="font-medium mb-3">CV hiện tại</h4>
                {resumes.length === 0 ? (
                    <Empty description="Chưa có CV nào" />
                ) : (
                    <Radio.Group
                        onChange={(e) => {
                            setSelectedResume(e.target.value);
                            const selected = resumes.find((r) => r.id === e.target.value);
                            if (selected?.path) {
                                onSelectMain(selected.path);
                            }
                        }}
                        value={selectedResume}
                        className="w-full space-y-3"
                    >
                        {resumes.map((resume) => (
                            <div key={resume.id} className="relative">
                                <Radio
                                    value={resume.id}
                                    className="w-full py-4 px-4 rounded-lg transition-all"
                                    style={{
                                        border:
                                            selectedResume === resume.id
                                                ? "1px solid #1890ff"
                                                : "1px solid #d9d9d9",
                                        backgroundColor:
                                            selectedResume === resume.id ? "#e6f7ff" : "white",
                                    }}
                                >
                                    <div className="flex justify-between items-center w-full">
                                        <div className="flex items-center">
                                            <span className="font-medium mr-4">
                                                {resume.name}
                                                {resume.isMain && (
                                                    <Tag color="blue" className="ml-2">
                                                        CV chính
                                                    </Tag>
                                                )}
                                            </span>
                                            {resume.path && (
                                                <Space size="small" className="ml-2">
                                                    {(() => {
                                                        return (
                                                            <>
                                                                <Button type="link" onClick={() => openProtectedFile(resume.path, false)}>Xem</Button>
                                                                <Button type="link" onClick={() => openProtectedFile(resume.path, true)}>Tải xuống</Button>
                                                            </>
                                                        );
                                                    })()}
                                                </Space>
                                            )}
                                        </div>
                                        <EyeOutlined className="text-gray-500 hover:text-blue-500 cursor-pointer" />
                                    </div>
                                </Radio>
                                {resume.isMain && (
                                    <div className="absolute top-0 right-0 p-4 text-sm text-gray-500">
                                        <span className="mr-3">
                                            {profileData?.name} <Tag color="blue">{resume.percent}%</Tag>
                                        </span>
                                        <span className="text-blue-500 cursor-pointer flex items-center">
                                            Hoàn thành CV của bạn <RightCircleOutlined className="ml-1" />
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </Radio.Group>
                )}

                <div className="pt-6">
                    <Upload
                        name="resume"
                        accept=".doc,.docx,.pdf"
                        beforeUpload={() => false}
                        onChange={(info) => onUpload(info.file)}
                    >
                        <Button type="primary" icon={<UploadOutlined />} loading={uploading} className="bg-blue-600 hover:bg-blue-700">
                            Tải CV mới lên
                        </Button>
                    </Upload>
                    <p className="text-xs text-gray-500 mt-2">
                        Hỗ trợ * .doc, * .docx, * .pdf và ≤5MB
                    </p>
                </div>
            </Card>

            <Card className="shadow-md">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">
                    Ẩn CV Chính Của Tôi Khỏi Nhà Tuyển Dụng
                </h3>
                <Row gutter={[16, 16]}>
                    <Col span={12}>
                        <h4 className="font-medium mb-2">Nhập tên công ty</h4>
                        <Input placeholder="Nhập tên công ty..." />
                    </Col>
                    <Col span={12}>
                        <h4 className="font-medium mb-2">Hoặc nhập website công ty</h4>
                        <Input placeholder="Nhập website..." />
                    </Col>
                </Row>
            </Card>

            <Card title={<h3 className="text-lg font-semibold text-blue-600">Công ty đã xem CV</h3>} className="shadow-md">
                <p className="text-gray-500">Chưa có công ty nào xem CV</p>
            </Card>
        </div>
    );
};

const JobListTab = ({ loading, jobs, onDelete, deleteLabel }) => {
    // Ensure jobs is always an array
    const jobsArray = Array.isArray(jobs) ? jobs : [];
    const navigate = useNavigate();
    
    if (loading) return <Spin />;
    if (jobsArray.length === 0) return <Empty description={`Chưa có ${deleteLabel}`} />;

    return (
        <div className="space-y-3">
            {jobsArray.map((job, idx) => (
                <Card key={job._id || idx} className="shadow-sm hover:shadow-md transition">
                    <Row justify="space-between" align="middle">
                        <Col span={20}>
                            <h4
                                className="font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                                onClick={() => {
                                    // job.jobId may be populated object or an id string
                                    const jobId = job?.jobId?._id || job?.jobId || job?._id;
                                    if (jobId) navigate(`/job/${jobId}`);
                                }}
                            >
                                {job?.jobId?.title || "Vị trí tuyên dụng"}
                            </h4>
                            <p className="text-gray-600 text-sm">{job?.jobId?.companyId?.name || "Công ty"}</p>
                            <div className="flex gap-4 text-xs text-gray-500 mt-2">
                                <span>📍 {job?.jobId?.location || "Chưa rõ"}</span>
                                <span>💰 {job?.jobId?.salary || "Thương lượng"}</span>
                                <span>{new Date(job?.appliedDate || job?.savedDate || job?.viewedDate).toLocaleDateString('vi-VN')}</span>
                            </div>
                        </Col>
                        <Col span={4} className="flex justify-end">
                            <Button
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(job._id);
                                }}
                            >
                                Xóa
                            </Button>
                        </Col>
                    </Row>
                </Card>
            ))}
        </div>
    );
};

const MainContent = ({ profileData }) => {
    const [selectedResume, setSelectedResume] = useState("main");
    const [applications, setApplications] = useState([]);
    const [savedJobs, setSavedJobs] = useState([]);
    const [viewedJobs, setViewedJobs] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Use resume management hook
    const { resumes, loading: resumeLoading, uploadNewResume, setMainResume } = useResumeManagement();

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [appRes, savedRes, viewedRes] = await Promise.all([
                getApplications(),
                getSavedJobs(),
                getViewedJobs(),
            ]);

            // API responses are { data: [...] } so use .data.data
            setApplications((appRes && appRes.data && appRes.data.data) || []);
            setSavedJobs((savedRes && savedRes.data && savedRes.data.data) || []);
            setViewedJobs((viewedRes && viewedRes.data && viewedRes.data.data) || []);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            message.error("Lỗi khi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    const handleUploadResume = async (file) => {
        const res = await uploadNewResume(file);
        if (res) {
            setSelectedResume("main");
        }
    };

    const handleDeleteApplication = async (appId) => {
        try {
            await withdrawApplication(appId);
            setApplications(applications.filter((app) => app._id !== appId));
            message.success("Rút đơn ứng tuyển thành công");
        } catch (error) {
            message.error("Lỗi khi rút đơn: " + error.message);
        }
    };

    const handleDeleteSavedJob = async (jobId) => {
        try {
            await unsaveJob(jobId);
            setSavedJobs(savedJobs.filter((job) => job._id !== jobId));
            message.success("Xóa công việc khỏi danh sách lưu");
        } catch (error) {
            message.error("Lỗi khi xóa: " + error.message);
        }
    };

    const handleDeleteViewedJob = async (jobViewId) => {
        try {
            await removeViewedJob(jobViewId);
            setViewedJobs(viewedJobs.filter((job) => job._id !== jobViewId));
            message.success("Xóa công việc khỏi danh sách xem");
        } catch (error) {
            message.error("Lỗi khi xóa: " + error.message);
        }
    };

    const subTabs = [
        {
            key: "1",
            label: "Lợi mời ứng tuyển",
            children: (
                <ContentLoiMoiUngTuyen
                    selectedResume={selectedResume}
                    setSelectedResume={setSelectedResume}
                    resumes={resumes}
                    profileData={profileData}
                    onUpload={handleUploadResume}
                    uploading={resumeLoading}
                    onSelectMain={setMainResume}
                />
            ),
        },
        {
            key: "2",
            label: "Việc đã ứng tuyển",
            children: (
                <JobListTab
                    loading={loading}
                    jobs={applications}
                    onDelete={handleDeleteApplication}
                    deleteLabel="đơn ứng tuyển"
                />
            ),
        },
        {
            key: "3",
            label: "Việc đã lưu",
            children: (
                <JobListTab
                    loading={loading}
                    jobs={savedJobs}
                    onDelete={handleDeleteSavedJob}
                    deleteLabel="công việc lưu"
                />
            ),
        },
        {
            key: "4",
            label: "Việc đã xem",
            children: (
                <JobListTab
                    loading={loading}
                    jobs={viewedJobs}
                    onDelete={handleDeleteViewedJob}
                    deleteLabel="công việc xem"
                />
            ),
        },
    ];

    return (
        <div className="mt-5">
            <Tabs defaultActiveKey="1" items={subTabs} />
        </div>
    );
};

function JobMana() {
    const [profileData, setProfileData] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile();
                setProfileData(response.data);
            } catch (error) {
                console.error("Lỗi khi tải thông tin hồ sơ:", error);
            }
        };
        fetchProfile();
    }, []);

    return (
        <div className="container mx-auto px-6 py-6 bg-gray-50 min-h-screen">
            <Row gutter={24}>
                <Col span={6}>
                    <JobManagementSidebar profileData={profileData} />
                </Col>
                <Col span={18}>
                    <MainContent profileData={profileData} />
                </Col>
            </Row>
        </div>
    );
}
export default JobMana;