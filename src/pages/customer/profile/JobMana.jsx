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

const ContentLoiMoiUngTuyen = ({
    selectedResume,
    setSelectedResume,
    resumes,
    profileData,
    onUpload,
    uploading,
    onSelectMain,
}) => {
    return (
        <div className="space-y-6">
            <Card className="shadow-md">
                <h3 className="text-lg font-semibold mb-4">
                    Chọn CV Chính Của Bạn Để Hiển Thị Cho Nhà Tuyển Dụng
                </h3>

                <h4 className="font-medium mb-3">CV hiện tại</h4>

                {resumes.length === 0 ? (
                    <Empty description="Chưa có CV nào" />
                ) : (
                    <Radio.Group
                        value={selectedResume}
                        onChange={(e) => {
                            setSelectedResume(e.target.value);
                            onSelectMain(e.target.value); // path
                        }}
                    >

                        {resumes.map((resume) => (
                            <div key={resume.id} className="relative">
                                <Radio
                                    value={resume.path}
                                    className="w-full py-4 px-4 rounded-lg"
                                    style={{
                                        border:
                                            selectedResume === resume.id
                                                ? "1px solid #1890ff"
                                                : "1px solid #d9d9d9",
                                        background:
                                            selectedResume === resume.id
                                                ? "#e6f7ff"
                                                : "#fff",
                                    }}
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <b>{resume.name}</b>
                                            {resume.isMain && (
                                                <Tag color="blue" className="ml-2">
                                                    CV chính
                                                </Tag>
                                            )}
                                            {resume.path && (
                                                <Space className="ml-3">
                                                    <Button
                                                        type="link"
                                                        onClick={() =>
                                                            openProtectedFile(
                                                                resume.path,
                                                                false
                                                            )
                                                        }
                                                    >
                                                        Xem
                                                    </Button>
                                                    <Button
                                                        type="link"
                                                        onClick={() =>
                                                            openProtectedFile(
                                                                resume.path,
                                                                true
                                                            )
                                                        }
                                                    >
                                                        Tải
                                                    </Button>
                                                </Space>
                                            )}
                                        </div>
                                        <EyeOutlined />
                                    </div>
                                </Radio>
                            </div>
                        ))}
                    </Radio.Group>
                )}

                <div className="pt-6">
                    <Upload
                        accept=".doc,.docx,.pdf"
                        beforeUpload={() => false}
                        onChange={(i) => onUpload(i.file)}
                    >
                        <Button
                            type="primary"
                            icon={<UploadOutlined />}
                            loading={uploading}
                        >
                            Tải CV mới lên
                        </Button>
                    </Upload>
                </div>
            </Card>
        </div>
    );
};

const JobListTab = ({ loading, jobs, onDelete, deleteLabel }) => {
    const jobsArray = Array.isArray(jobs) ? jobs : [];
    const navigate = useNavigate();

    if (loading) return <Spin />;
    if (jobsArray.length === 0)
        return <Empty description={`Chưa có ${deleteLabel}`} />;

    return (
        <div className="space-y-3">
            {jobsArray.map((job) => (
                <Card key={job._id}>
                    <Row justify="space-between">
                        <Col span={20}>
                            <h4
                                className="text-blue-600 cursor-pointer"
                                onClick={() =>
                                    navigate(`/job/${job?.jobId?._id}`)
                                }
                            >
                                {job?.jobId?.title}
                            </h4>
                            <p>{job?.jobId?.companyId?.name}</p>
                        </Col>
                        <Col span={4}>
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => onDelete(job._id)}
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
    const [selectedResume, setSelectedResume] = useState(null);
    const [applications, setApplications] = useState([]);
    const [savedJobs, setSavedJobs] = useState([]);
    const [viewedJobs, setViewedJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    const {
        resumes,
        loading: resumeLoading,
        uploadNewResume,
        setMainResume,
    } = useResumeManagement();

    useEffect(() => {
        const main = resumes.find((r) => r.isMain);
        if (main?.path) {
            setSelectedResume(main.path);
        }
    }, [resumes]);


    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            setLoading(true);
            const [a, s, v] = await Promise.all([
                getApplications(),
                getSavedJobs(),
                getViewedJobs(),
            ]);
            setApplications(a?.data?.data || []);
            setSavedJobs(s?.data?.data || []);
            setViewedJobs(v?.data?.data || []);
        } finally {
            setLoading(false);
        }
    };

    const subTabs = [
        {
            key: "1",
            label: "Lời mời ứng tuyển",
            children: (
                <ContentLoiMoiUngTuyen
                    selectedResume={selectedResume}
                    setSelectedResume={setSelectedResume}
                    resumes={resumes}
                    profileData={profileData}
                    onUpload={uploadNewResume}
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
                    onDelete={withdrawApplication}
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
                    onDelete={unsaveJob}
                    deleteLabel="việc đã lưu"
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
                    onDelete={removeViewedJob}
                    deleteLabel="việc đã xem"
                />
            ),
        },
    ];

    return <Tabs defaultActiveKey="1" items={subTabs} />;
};

export default function JobMana() {
    const [profileData, setProfileData] = useState({});

    useEffect(() => {
        getProfile().then((res) => setProfileData(res.data));
    }, []);

    return (
        <div className="container mx-auto px-6 py-6">
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
