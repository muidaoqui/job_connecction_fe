import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Form,
    Input,
    Button,
    DatePicker,
    Radio,
    Upload,
    message,
    Card,
    Row,
    Col,
    Modal,
    Select,
    Space,
    Empty,
    Tag,
    Switch
} from "antd";
import {
    UploadOutlined,
    SaveOutlined,
    DownloadOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,

} from "@ant-design/icons";
import dayjs from "dayjs";
import ProfileSidebar from "../../../components/customer/ProfileSidebar";
import { useResumeManagement } from "../../../hooks/useResumeManagement";
import {
    getProfile,
    createProfile,
    updateProfile,
    getExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
    getSkills,
    createSkill,
    updateSkill,
    deleteSkill,
    endorseSkill,
    getEducations,
    createEducation,
    updateEducation,
    deleteEducation,
    getProjects,
    createProject,
    updateProject,
    deleteProject,
} from "../../../api/profileAPI";

const GeneralInformationForm = ({ form, candidate, loading, onFinish }) => (
    <Card
        title={
            <div className="flex justify-between items-center">
                Thông tin chung (General Information)
                <Button icon={<EditOutlined />} type="link">
                    Chỉnh sửa
                </Button>
            </div>
        }
        className="mt-5"
        extra={<Tag color="blue">Đạt 50% từ mục này</Tag>}
    >
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
        >
            <div className="flex items-center mb-5">
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mr-5">
                </div>
                <div className="flex-1">
                    <Form.Item label="Họ và tên" name="name" className="mb-3">
                        <Input placeholder="Nhập họ và tên" />
                    </Form.Item>
                </div>
            </div>

            <Form.Item label="Địa chỉ" name="address">
                <Input placeholder="Nhập địa chỉ" />
            </Form.Item>

            <Form.Item label="Ngày sinh" name="dateOfBirth">
                <DatePicker />
            </Form.Item>

            <Form.Item label="Giới tính" name="gender">
                <Radio.Group>
                    <Radio value="male">Nam</Radio>
                    <Radio value="female">Nữ</Radio>
                </Radio.Group>
            </Form.Item>

            <Form.Item label="Tóm tắt hồ sơ" name="profileSummary">
                <Input.TextArea rows={4} placeholder="Nhập tóm tắt hồ sơ của bạn" />
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={loading} block>
                Lưu thông tin
            </Button>
        </Form>
    </Card>
);

const MySaramin = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [profileData, setProfileData] = useState(null);
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Experience states
    const [experiences, setExperiences] = useState([]);
    const [experienceFormVisible, setExperienceFormVisible] = useState(false);
    const [editingExperience, setEditingExperience] = useState(null);
    
    // Skill states
    const [skills, setSkills] = useState([]);
    const [skillFormVisible, setSkillFormVisible] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    
    // Education states
    const [educations, setEducations] = useState([]);
    const [educationFormVisible, setEducationFormVisible] = useState(false);
    const [editingEducation, setEditingEducation] = useState(null);
    
    // Project states
    const [projects, setProjects] = useState([]);
    const [projectFormVisible, setProjectFormVisible] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    
    // Use resume management hook
    const { resumes, mainResume, loading: resumeLoading, uploadNewResume } = useResumeManagement();

    // Fetch all data
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const token = localStorage.getItem("token");
                console.log("Token:", token);
                
                if (!token) {
                    message.error("Vui lòng đăng nhập để xem thông tin");
                    setTimeout(() => navigate("/login"), 1500);
                    return;
                }

                const [profileRes, expRes, skillRes, eduRes, projRes] = await Promise.all([
                    getProfile(),
                    getExperiences(),
                    getSkills(),
                    getEducations(),
                    getProjects(),
                ]);

                setCandidate(profileRes.data.candidate);
                setExperiences(expRes.data);
                setSkills(skillRes.data);
                setEducations(eduRes.data);
                setProjects(projRes.data);

                if (profileRes.data) {
                    setProfileData(profileRes.data);
                    form.setFieldsValue({
                        name: profileRes.data.name,
                        address: profileRes.data.candidate?.address,
                        gender: profileRes.data.candidate?.gender,
                        dateOfBirth: profileRes.data.candidate?.dateOfBirth
                            ? dayjs(profileRes.data.candidate.dateOfBirth)
                            : null,
                        profileSummary: profileRes.data.candidate?.profileSummary,
                    });
                }
            } catch (err) {
                console.error(err);
                message.error("Lỗi khi tải dữ liệu");
            }
        };
        fetchAllData();
    }, [form]);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const data = {
                ...values,
                dateOfBirth: values.dateOfBirth
                    ? values.dateOfBirth.toISOString()
                    : null,
            };

            if (candidate) {
                await updateProfile(data);
                message.success("Cập nhật profile thành công");
            } else {
                await createProfile(data);
                message.success("Tạo profile thành công");
            }
        } catch (error) {
            message.error("Lưu profile thất bại");
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async ({ file }) => {
        await uploadNewResume(file);
    };

    // Experience handlers
    const handleAddExperience = async (values) => {
        try {
            const data = {
                ...values,
                startDate: values.startDate ? values.startDate.toISOString() : null,
                endDate: values.endDate ? values.endDate.toISOString() : null,
            };

            if (editingExperience) {
                await updateExperience(editingExperience._id, data);
                message.success("Cập nhật kinh nghiệm thành công");
            } else {
                await createExperience(data);
                message.success("Thêm kinh nghiệm thành công");
            }
            const res = await getExperiences();
            setExperiences(res.data);
            setExperienceFormVisible(false);
            setEditingExperience(null);
        } catch (error) {
            console.error(error);
            message.error("Lỗi khi lưu kinh nghiệm");
        }
    };

    const handleDeleteExperience = async (id) => {
        try {
            await deleteExperience(id);
            message.success("Xóa kinh nghiệm thành công");
            const res = await getExperiences();
            setExperiences(res.data);
        } catch (error) {
            message.error("Lỗi khi xóa kinh nghiệm");
        }
    };

    // Skill handlers
    const handleAddSkill = async (values) => {
        try {
            if (editingSkill) {
                await updateSkill(editingSkill._id, values);
                message.success("Cập nhật kỹ năng thành công");
            } else {
                await createSkill(values);
                message.success("Thêm kỹ năng thành công");
            }
            const res = await getSkills();
            setSkills(res.data);
            setSkillFormVisible(false);
            setEditingSkill(null);
        } catch (error) {
            message.error("Lỗi khi lưu kỹ năng");
        }
    };

    const handleDeleteSkill = async (id) => {
        try {
            await deleteSkill(id);
            message.success("Xóa kỹ năng thành công");
            const res = await getSkills();
            setSkills(res.data);
        } catch (error) {
            message.error("Lỗi khi xóa kỹ năng");
        }
    };

    // Education handlers
    const handleAddEducation = async (values) => {
        try {
            const data = {
                ...values,
                startDate: values.startDate ? values.startDate.toISOString() : null,
                endDate: values.endDate ? values.endDate.toISOString() : null,
            };

            if (editingEducation) {
                await updateEducation(editingEducation._id, data);
                message.success("Cập nhật học vấn thành công");
            } else {
                await createEducation(data);
                message.success("Thêm học vấn thành công");
            }
            const res = await getEducations();
            setEducations(res.data);
            setEducationFormVisible(false);
            setEditingEducation(null);
        } catch (error) {
            console.error(error);
            message.error("Lỗi khi lưu học vấn");
        }
    };

    const handleDeleteEducation = async (id) => {
        try {
            await deleteEducation(id);
            message.success("Xóa học vấn thành công");
            const res = await getEducations();
            setEducations(res.data);
        } catch (error) {
            message.error("Lỗi khi xóa học vấn");
        }
    };

    // Project handlers
    const handleAddProject = async (values) => {
        try {
            const data = {
                ...values,
                startDate: values.startDate ? values.startDate.toISOString() : null,
                endDate: values.endDate ? values.endDate.toISOString() : null,
            };

            if (editingProject) {
                await updateProject(editingProject._id, data);
                message.success("Cập nhật dự án thành công");
            } else {
                await createProject(data);
                message.success("Thêm dự án thành công");
            }
            const res = await getProjects();
            setProjects(res.data);
            setProjectFormVisible(false);
            setEditingProject(null);
        } catch (error) {
            console.error(error);
            message.error("Lỗi khi lưu dự án");
        }
    };

    const handleDeleteProject = async (id) => {
        try {
            await deleteProject(id);
            message.success("Xóa dự án thành công");
            const res = await getProjects();
            setProjects(res.data);
        } catch (error) {
            message.error("Lỗi khi xóa dự án");
        }
    };

    return (
        <div className="container mx-auto px-6 py-6 bg-gray-50 min-h-screen">

            <Row gutter={24} className="mt-5">

                <Col span={6}>
                    <ProfileSidebar userName={profileData?.name} />
                </Col>

                <Col span={18}>
                    <Card
                        className="mb-5"
                        actions={[
                            <Upload
                                key="import"
                                maxCount={1}
                                accept=".pdf,.doc,.docx"
                                beforeUpload={() => false}
                                onChange={({ file }) => handleUpload({ file })}
                            >
                                <Button type="primary" icon={<DownloadOutlined />} loading={resumeLoading}>
                                    Nhập CV của bạn
                                </Button>
                            </Upload>,
                            <Button 
                                key="save" 
                                icon={<SaveOutlined />}
                                onClick={() => {
                                    form.submit();
                                }}
                            >
                                Lưu lại
                            </Button>,
                        ]}
                    >
                        <h2>Saramin CV</h2>
                        <p>
                            Nâng cấp CV của bạn theo chuẩn ATS bằng cách tải lên, chuyển đổi, và
                            tải CV Saramin dưới dạng PDF để ứng tuyển công việc với định dạng thân thiện với ATS.
                        </p>
                    </Card>

                    <GeneralInformationForm
                        form={form}
                        candidate={candidate}
                        loading={loading}
                        onFinish={onFinish}
                    />

                    {/* Kinh nghiệm Section */}
                    <Card
                        title="Kinh nghiệm"
                        extra={<Tag color="blue">Đạt 50% từ mục này</Tag>}
                        className="mt-5"
                    >
                        {experiences.length > 0 ? (
                            <div>
                                {experiences.map((exp) => (
                                    <Card key={exp._id} size="small" className="mb-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold">{exp.jobTitle}</h4>
                                                <p className="text-sm text-gray-600">{exp.company}</p>
                                                <p className="text-xs text-gray-500">
                                                    {dayjs(exp.startDate).format("MM/YYYY")} -{" "}
                                                    {exp.isCurrentJob ? "Hiện tại" : dayjs(exp.endDate).format("MM/YYYY")}
                                                </p>
                                                {exp.description && (
                                                    <p className="text-sm mt-2">{exp.description}</p>
                                                )}
                                            </div>
                                            <Space>
                                                <Button
                                                    size="small"
                                                    icon={<EditOutlined />}
                                                    onClick={() => setEditingExperience(exp)}
                                                />
                                                <Button
                                                    size="small"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => handleDeleteExperience(exp._id)}
                                                />
                                            </Space>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Empty description="Chưa có kinh nghiệm nào" />
                        )}
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setExperienceFormVisible(true)}
                            className="mt-3"
                        >
                            Thêm kinh nghiệm
                        </Button>
                    </Card>

                    {/* Kỹ năng Section */}
                    <Card title="Kỹ năng" className="mt-5">
                        {skills.length > 0 ? (
                            <div>
                                {skills.map((skill) => (
                                    <Card key={skill._id} size="small" className="mb-3">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="font-bold">{skill.skillName}</h4>
                                                <p className="text-sm text-gray-600">
                                                    {skill.proficiency} - {skill.endorsements} endorsements
                                                </p>
                                            </div>
                                            <Space>
                                                <Button
                                                    size="small"
                                                    icon={<EditOutlined />}
                                                    onClick={() => setEditingSkill(skill)}
                                                />
                                                <Button
                                                    size="small"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => handleDeleteSkill(skill._id)}
                                                />
                                            </Space>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Empty description="Chưa có kỹ năng nào" />
                        )}
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setSkillFormVisible(true)}
                            className="mt-3"
                        >
                            Thêm kỹ năng
                        </Button>
                    </Card>

                    {/* Trình độ học vấn Section */}
                    <Card title="Trình độ học vấn" className="mt-5">
                        {educations.length > 0 ? (
                            <div>
                                {educations.map((edu) => (
                                    <Card key={edu._id} size="small" className="mb-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold">{edu.school}</h4>
                                                <p className="text-sm text-gray-600">
                                                    {edu.degree} - {edu.fieldOfStudy}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {dayjs(edu.startDate).format("YYYY")} - {dayjs(edu.endDate).format("YYYY")}
                                                </p>
                                                {edu.grade && (
                                                    <p className="text-sm">GPA: {edu.grade}</p>
                                                )}
                                            </div>
                                            <Space>
                                                <Button
                                                    size="small"
                                                    icon={<EditOutlined />}
                                                    onClick={() => setEditingEducation(edu)}
                                                />
                                                <Button
                                                    size="small"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => handleDeleteEducation(edu._id)}
                                                />
                                            </Space>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Empty description="Chưa có học vấn nào" />
                        )}
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setEducationFormVisible(true)}
                            className="mt-3"
                        >
                            Thêm học vấn
                        </Button>
                    </Card>

                    {/* Dự án Section */}
                    <Card title="Dự án" className="mt-5">
                        {projects.length > 0 ? (
                            <div>
                                {projects.map((proj) => (
                                    <Card key={proj._id} size="small" className="mb-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold">{proj.projectName}</h4>
                                                <p className="text-xs text-gray-500">
                                                    {dayjs(proj.startDate).format("MM/YYYY")} - {dayjs(proj.endDate).format("MM/YYYY")}
                                                </p>
                                                {proj.description && (
                                                    <p className="text-sm mt-2">{proj.description}</p>
                                                )}
                                                {proj.skills && proj.skills.length > 0 && (
                                                    <div className="mt-2">
                                                        {proj.skills.map((skill) => (
                                                            <Tag key={skill} color="blue">{skill}</Tag>
                                                        ))}
                                                    </div>
                                                )}
                                                {proj.projectUrl && (
                                                    <a href={proj.projectUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                                        Xem dự án
                                                    </a>
                                                )}
                                            </div>
                                            <Space>
                                                <Button
                                                    size="small"
                                                    icon={<EditOutlined />}
                                                    onClick={() => setEditingProject(proj)}
                                                />
                                                <Button
                                                    size="small"
                                                    danger
                                                    icon={<DeleteOutlined />}
                                                    onClick={() => handleDeleteProject(proj._id)}
                                                />
                                            </Space>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Empty description="Chưa có dự án nào" />
                        )}
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setProjectFormVisible(true)}
                            className="mt-3"
                        >
                            Thêm dự án
                        </Button>
                    </Card>
                </Col>
            </Row>

            {/* Experience Modal */}
            <Modal
                title={editingExperience ? "Sửa kinh nghiệm" : "Thêm kinh nghiệm"}
                open={experienceFormVisible}
                onCancel={() => {
                    setExperienceFormVisible(false);
                    setEditingExperience(null);
                }}
                footer={null}
            >
                <Form
                    layout="vertical"
                    onFinish={handleAddExperience}
                    initialValues={editingExperience}
                >
                    <Form.Item label="Vị trí công việc" name="jobTitle" rules={[{ required: true }]}>
                        <Input placeholder="VD: Senior Developer" />
                    </Form.Item>
                    <Form.Item label="Công ty" name="company" rules={[{ required: true }]}>
                        <Input placeholder="VD: Tech Company" />
                    </Form.Item>
                    <Form.Item label="Ngày bắt đầu" name="startDate" rules={[{ required: true }]}>
                        <DatePicker />
                    </Form.Item>
                    <Form.Item label="Ngày kết thúc" name="endDate">
                        <DatePicker />
                    </Form.Item>
                    <Form.Item label="Công việc hiện tại" name="isCurrentJob" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        {editingExperience ? "Cập nhật" : "Thêm"}
                    </Button>
                </Form>
            </Modal>

            {/* Skill Modal */}
            <Modal
                title={editingSkill ? "Sửa kỹ năng" : "Thêm kỹ năng"}
                open={skillFormVisible}
                onCancel={() => {
                    setSkillFormVisible(false);
                    setEditingSkill(null);
                }}
                footer={null}
            >
                <Form
                    layout="vertical"
                    onFinish={handleAddSkill}
                    initialValues={editingSkill}
                >
                    <Form.Item label="Tên kỹ năng" name="skillName" rules={[{ required: true }]}>
                        <Input placeholder="VD: React, Node.js" />
                    </Form.Item>
                    <Form.Item label="Trình độ" name="proficiency" rules={[{ required: true }]}>
                        <Select
                            options={[
                                { label: "Beginner", value: "beginner" },
                                { label: "Intermediate", value: "intermediate" },
                                { label: "Advanced", value: "advanced" },
                                { label: "Expert", value: "expert" },
                            ]}
                        />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        {editingSkill ? "Cập nhật" : "Thêm"}
                    </Button>
                </Form>
            </Modal>

            {/* Education Modal */}
            <Modal
                title={editingEducation ? "Sửa học vấn" : "Thêm học vấn"}
                open={educationFormVisible}
                onCancel={() => {
                    setEducationFormVisible(false);
                    setEditingEducation(null);
                }}
                footer={null}
            >
                <Form
                    layout="vertical"
                    onFinish={handleAddEducation}
                    initialValues={editingEducation}
                >
                    <Form.Item label="Trường học" name="school" rules={[{ required: true }]}>
                        <Input placeholder="VD: ĐH Bách Khoa" />
                    </Form.Item>
                    <Form.Item label="Bằng cấp" name="degree" rules={[{ required: true }]}>
                        <Input placeholder="VD: Cử nhân" />
                    </Form.Item>
                    <Form.Item label="Ngành học" name="fieldOfStudy" rules={[{ required: true }]}>
                        <Input placeholder="VD: Công nghệ thông tin" />
                    </Form.Item>
                    <Form.Item label="Ngày bắt đầu" name="startDate" rules={[{ required: true }]}>
                        <DatePicker />
                    </Form.Item>
                    <Form.Item label="Ngày kết thúc" name="endDate">
                        <DatePicker />
                    </Form.Item>
                    <Form.Item label="GPA" name="grade">
                        <Input placeholder="VD: 3.5" />
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        {editingEducation ? "Cập nhật" : "Thêm"}
                    </Button>
                </Form>
            </Modal>

            {/* Project Modal */}
            <Modal
                title={editingProject ? "Sửa dự án" : "Thêm dự án"}
                open={projectFormVisible}
                onCancel={() => {
                    setProjectFormVisible(false);
                    setEditingProject(null);
                }}
                footer={null}
            >
                <Form
                    layout="vertical"
                    onFinish={handleAddProject}
                    initialValues={editingProject}
                >
                    <Form.Item label="Tên dự án" name="projectName" rules={[{ required: true }]}>
                        <Input placeholder="VD: E-commerce Platform" />
                    </Form.Item>
                    <Form.Item label="Ngày bắt đầu" name="startDate" rules={[{ required: true }]}>
                        <DatePicker />
                    </Form.Item>
                    <Form.Item label="Ngày kết thúc" name="endDate">
                        <DatePicker />
                    </Form.Item>
                    <Form.Item label="Mô tả" name="description">
                        <Input.TextArea rows={3} placeholder="Mô tả chi tiết dự án" />
                    </Form.Item>
                    <Form.Item label="Kỹ năng sử dụng" name="skills">
                        <Select
                            mode="tags"
                            placeholder="VD: React, Node.js, MongoDB"
                        />
                    </Form.Item>
                    <Form.Item label="Link dự án" name="projectUrl">
                        <Input placeholder="VD: https://example.com" />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        {editingProject ? "Cập nhật" : "Thêm"}
                    </Button>
                </Form>
            </Modal>
        </div>
    );
};

export default MySaramin;