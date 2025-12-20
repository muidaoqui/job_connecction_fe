import React, { useState, useEffect } from "react";
import {
    Card,
    Row,
    Col,
    Button,
    Tabs,
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
    DeleteOutlined,
} from "@ant-design/icons";
import ProfileSidebar from "../../../components/customer/ProfileSidebar";
import { useNavigate } from "react-router-dom";
import { useResumeManagement } from "../../../hooks/useResumeManagement";
import { openProtectedFile } from "../../../utils/fileHelpers";
import {
    getApplications,
    getSavedJobs,
    withdrawApplication,
    unsaveJob,
    getProfile,
    getFollowedCompanies,
    unfollowCompany,
} from "../../../api/profileAPI";

/* ===================== SIDEBAR ===================== */
const JobManagementSidebar = ({ profileData }) => (
    <ProfileSidebar userName={profileData?.name} />
);

/* ===================== LOI MOI UNG TUYEN ===================== */
const ContentLoiMoiUngTuyen = ({
    selectedResume,
    setSelectedResume,
    resumes,
    onUpload,
    uploading,
    onSelectMain,
}) => {
    return (
        <Card className="shadow-md">
            <h3 className="text-lg font-semibold mb-4">
                Chọn CV chính để hiển thị cho nhà tuyển dụng
            </h3>

            {resumes.length === 0 ? (
                <Empty description="Chưa có CV nào" />
            ) : (
                <Radio.Group
                    value={selectedResume}
                    onChange={(e) => {
                        setSelectedResume(e.target.value);
                        onSelectMain(e.target.value);
                    }}
                >
                    {resumes.map((resume) => (
                        <Radio
                            key={resume._id}
                            value={resume.path}
                            className="w-full block p-3 rounded mb-2 border"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <b>{resume.name}</b>
                                    {resume.isMain && (
                                        <Tag color="blue" className="ml-2">
                                            CV chính
                                        </Tag>
                                    )}
                                    <Space className="ml-3">
                                        <Button
                                            type="link"
                                            onClick={() =>
                                                openProtectedFile(resume.path, false)
                                            }
                                        >
                                            Xem
                                        </Button>
                                        <Button
                                            type="link"
                                            onClick={() =>
                                                openProtectedFile(resume.path, true)
                                            }
                                        >
                                            Tải
                                        </Button>
                                    </Space>
                                </div>
                                <EyeOutlined />
                            </div>
                        </Radio>
                    ))}
                </Radio.Group>
            )}

            <div className="mt-4">
                <Upload
                    accept=".pdf,.doc,.docx"
                    beforeUpload={() => false}
                    onChange={(i) => onUpload(i.file)}
                >
                    <Button
                        type="primary"
                        icon={<UploadOutlined />}
                        loading={uploading}
                    >
                        Tải CV mới
                    </Button>
                </Upload>
            </div>
        </Card>
    );
};

/* ===================== JOB CARD ===================== */
const JobCard = ({ job, onDelete }) => {
    const navigate = useNavigate();
    const company = job?.jobId?.companyId;

    return (
        <Card className="shadow-sm hover:shadow-md">
            <Row justify="space-between" align="middle">
                <Col span={18}>
                    <div
                        className="flex gap-3 items-center cursor-pointer"
                        onClick={() => navigate(`/job/${job?.jobId?._id}`)}
                    >
                        {company?.logo && (
                            <img
                                src={company.logo}
                                alt={company.name}
                                className="w-12 h-12 object-contain border rounded"
                            />
                        )}
                        <div>
                            <h4 className="text-blue-600 font-semibold">
                                {job?.jobId?.title}
                            </h4>
                            <p className="text-sm text-gray-600">
                                {company?.name}
                            </p>
                            <div className="mt-1">
                                {job?.jobId?.salary && (
                                    <Tag color="green">{job.jobId.salary}</Tag>
                                )}
                                {job?.jobId?.location && (
                                    <Tag>{job.jobId.location}</Tag>
                                )}
                            </div>
                        </div>
                    </div>
                </Col>
                <Col span={6} className="text-right">
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
    );
};

/* ===================== JOB LIST TAB ===================== */
const JobListTab = ({ loading, jobs, onDelete, emptyLabel }) => {
    if (loading) return <Spin />;
    if (!jobs.length) return <Empty description={emptyLabel} />;

    return (
        <div className="space-y-3">
            {jobs.map((job) => (
                <JobCard
                    key={job._id}
                    job={job}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

/* ===================== FOLLOWED COMPANY ===================== */
const FollowedCompanyTab = ({ loading, companies, onUnfollow }) => {
    const navigate = useNavigate();

    if (loading) return <Spin />;
    if (!companies.length)
        return <Empty description="Chưa theo dõi công ty nào" />;

    return (
        <div className="space-y-3">
            {companies.map((item) => {
                const company = item.companyId;
                return (
                    <Card key={item._id}>
                        <Row justify="space-between" align="middle">
                            <Col span={18}>
                                <div
                                    className="flex gap-3 items-center cursor-pointer"
                                    onClick={() =>
                                        navigate(`/company/${company._id}`)
                                    }
                                >
                                    {company.logo && (
                                        <img
                                            src={company.logo}
                                            alt={company.name}
                                            className="w-12 h-12 object-contain border rounded"
                                        />
                                    )}
                                    <div>
                                        <h4 className="text-blue-600 font-semibold">
                                            {company.name}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {company.industry} · {company.country}
                                        </p>
                                    </div>
                                </div>
                            </Col>
                            <Col span={6} className="text-right">
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => onUnfollow(company._id)}
                                >
                                    Bỏ theo dõi
                                </Button>
                            </Col>
                        </Row>
                    </Card>
                );
            })}
        </div>
    );
};

/* ===================== MAIN CONTENT ===================== */
const MainContent = ({ profileData }) => {
    const [applications, setApplications] = useState([]);
    const [savedJobs, setSavedJobs] = useState([]);
    const [followedCompanies, setFollowedCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedResume, setSelectedResume] = useState(null);

    const {
        resumes,
        loading: resumeLoading,
        uploadNewResume,
        setMainResume,
    } = useResumeManagement();

    useEffect(() => {
        const main = resumes.find((r) => r.isMain);
        if (main) setSelectedResume(main.path);
    }, [resumes]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const [a, s, f] = await Promise.all([
            getApplications(),
            getSavedJobs(),
            getFollowedCompanies(),
        ]);
        setApplications(a?.data?.data || []);
        setSavedJobs(s?.data?.data || []);
        setFollowedCompanies(f?.data?.data || []);
        setLoading(false);
    };

    const handleUnfollow = async (id) => {
        await unfollowCompany(id);
        setFollowedCompanies((prev) =>
            prev.filter((i) => i.companyId._id !== id)
        );
        message.success("Đã bỏ theo dõi");
    };

    return (
        <Tabs
            defaultActiveKey="1"
            items={[
                {
                    key: "1",
                    label: "Lời mời ứng tuyển",
                    children: (
                        <ContentLoiMoiUngTuyen
                            selectedResume={selectedResume}
                            setSelectedResume={setSelectedResume}
                            resumes={resumes}
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
                            emptyLabel="Chưa có đơn ứng tuyển"
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
                            emptyLabel="Chưa có việc đã lưu"
                        />
                    ),
                },
                {
                    key: "4",
                    label: "Công ty đã theo dõi",
                    children: (
                        <FollowedCompanyTab
                            loading={loading}
                            companies={followedCompanies}
                            onUnfollow={handleUnfollow}
                        />
                    ),
                },
            ]}
        />
    );
};

/* ===================== PAGE ===================== */
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
