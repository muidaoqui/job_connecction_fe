import React, { useEffect, useState } from "react";
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
    Menu,
    Progress,
    Tag,
    Switch,
} from "antd";
import {
    UploadOutlined,
    SaveOutlined,
    DownloadOutlined,
    EditOutlined,
    CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
    getProfile,
    createProfile,
    updateProfile,
    uploadResume,
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
        <div className="flex items-center mb-5">
            <div
                className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mr-5"
            >
            </div>
            <div>
                <h3>
                    Múi Đào <Tag color="blue">20%</Tag>
                </h3>
                <p className="text-sm">
                    Thêm vị trí công việc - Thêm năm kinh nghiệm
                    <br />
                    Thêm địa chỉ
                    <br />
                    muidao156@gmail.com - 0773153987 - Thêm ngày sinh
                    <br />
                    Thêm liên kết mạng xã hội
                </p>
            </div>
        </div>
    </Card>
);

const MySaramin = () => {
    const [form] = Form.useForm();
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getProfile();
                const data = res.data;
                setCandidate(data.candidate);

                if (data) {
                    form.setFieldsValue({
                        name: data.name,
                        address: data.candidate?.address,
                        gender: data.candidate?.gender,
                        dateOfBirth: data.candidate?.dateOfBirth
                            ? dayjs(data.candidate.dateOfBirth)
                            : null,
                        profileSummary: data.candidate?.profileSummary,
                    });
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
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
        const formData = new FormData();
        formData.append("resume", file);
        try {
            await uploadResume(formData);
            message.success("Tải CV lên thành công");
        } catch (error) {
            message.error("Tải CV lên thất bại");
        }
    };

    return (
        <div className="container mx-auto px-6 py-6 bg-gray-50 min-h-screen">

            <Row gutter={24} className="mt-5">

                <Col span={6}>
                    <Card bodyStyle={{ padding: "16px 20px" }}>
                        <div className="text-center mb-5">
                            <Progress type="circle" percent={20} width={80} />
                            <h3 className="mt-2">Múi Đào</h3>
                            <p className="text-gray-500">20%</p>
                        </div>

                        <p>
                            Ứng tuyển nhanh hơn với Saramin CV bằng cách hoàn thành{" "}
                            <strong>Thông tin chung</strong>.
                        </p>
                        <p className="text-red-600 font-bold">
                            Bạn đang thiếu các thông tin sau:
                        </p>
                        <Menu mode="inline" selectable={false} className="border-r-0">
                            <Menu.Item key="1">
                                Tỉnh/Thành phố <Tag color="blue">+5%</Tag>
                            </Menu.Item>
                            <Menu.Item key="2">
                                Kỹ năng chuyên môn <Tag color="blue">+10%</Tag>
                            </Menu.Item>
                            <Menu.Item key="3">
                                Số năm kinh nghiệm <Tag color="blue">+10%</Tag>
                            </Menu.Item>
                            <Menu.Item key="4">
                                Vị trí <Tag color="blue">+5%</Tag>
                            </Menu.Item>
                        </Menu>

                        <hr className="my-5" />

                        <div className="flex items-center justify-between mt-5 mb-5 p-3 border border-gray-200 rounded-lg">
                            <div>
                                <h4 className="font-medium text-sm">Sẵn sàng làm việc</h4>
                                <p className="text-xs text-gray-600">
                                    Kích hoạt chế độ Sẵn sàng làm việc để kết nối với nhà tuyển dụng.
                                </p>
                            </div>
                            <Switch defaultChecked={false} />
                        </div>

                        <Button type="primary" className="w-full">
                            <CheckCircleOutlined /> Ứng tuyển ngay và nhận voucher &rarr;
                        </Button>
                    </Card>
                </Col>

                <Col span={18}>
                    <Card
                        className="mb-5"
                        actions={[
                            <Button key="import" type="primary" icon={<DownloadOutlined />}>
                                Nhập CV của bạn
                            </Button>,
                            <Button key="save" icon={<SaveOutlined />}>
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

                    <Card
                        title="Kinh nghiệm & Nền tảng"
                        extra={<Tag color="blue">Đạt 50% từ mục này</Tag>}
                        className="mt-5"
                    >
                        <div className="flex justify-between">
                            <div>
                                <h4>Tóm tắt</h4>
                                <p>
                                    Cung cấp thông tin chi tiết giúp chúng tôi dễ dàng tìm thấy các công việc phù hợp với bạn.
                                </p>
                            </div>
                            <Button icon={<EditOutlined />} type="link" />
                        </div>
                    </Card>

                    <Card title="Kỹ năng" className="mt-5">
                        <div className="flex justify-between">
                            <div>
                                <p>
                                    Chọn các kỹ năng thể hiện bạn phù hợp với vị trí để thu hút sự chú ý của nhà tuyển dụng và được coi là ứng viên tiềm năng.
                                </p>
                            </div>
                            <Button icon={<EditOutlined />} type="link" />
                        </div>
                    </Card>
                    <Card title="Kinh nghiệm" className="mt-5">
                        <div className="flex justify-between">
                            <div>
                                <p>
                                    Kinh nghiệm chi tiết phản ánh kỹ năng, giá trị và đóng góp của bạn trong thời gian bạn làm việc tại các công ty trước đây.
                                </p>
                            </div>
                            <Button icon={<EditOutlined />} type="link" />
                        </div>
                    </Card>
                    <Card title="Trình độ học vấn" className="mt-5">
                        <div className="flex justify-between">
                            <div>
                                <p>
                                    Thêm trình độ học vấn vào hồ sơ tóm tắt lý lịch của bạn và giá trị mà bạn đã đạt được và có thể hỗ trợ cho công việc.
                                </p>
                            </div>
                            <Button icon={<EditOutlined />} type="link" />
                        </div>
                    </Card>
                    <Card title="Dự án" className="mt-5">
                        <div className="flex justify-between">
                            <div>
                            </div>
                            <Button icon={<EditOutlined />} type="link" />
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default MySaramin;