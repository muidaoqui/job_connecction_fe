import React, { useState } from "react";
import {
    Card,
    Row,
    Col,
    Menu,
    Progress,
    Tag,
    Button,
    Switch,
    Tabs,
    Input,
    Radio,
} from "antd";
import {
    CheckCircleOutlined,
    EyeOutlined,
    UploadOutlined,
    RightCircleOutlined,
} from "@ant-design/icons";

const mockResumes = [
    {
        key: "main",
        name: "Múi Đào—qúi—mùi—full...",
        percent: 20,
        status: "Most recently applied CV",
        isMain: true,
    },
    {
        key: "other",
        name: "Đào Qúi Mùi - Full...",
        percent: 100,
        status: "",
        isMain: false,
    },
];

const JobManagementSidebar = () => (
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
);

const ContentLoiMoiUngTuyen = ({ selectedResume, setSelectedResume }) => (
    <div className="space-y-6">
        <Card className="shadow-md">
            <h3 className="text-lg font-semibold mb-4">
                Chọn CV Chính Của Bạn Để Hiển Thị Cho Nhà Tuyển Dụng
            </h3>
            <p className="text-sm text-gray-600 mb-6">
                Chọn CV hoàn chỉnh nhất để cung cấp thông tin đầy đủ cho Nhà Tuyển Dụng.
            </p>

            <h4 className="font-medium mb-3">CV hiện tại</h4>
            <Radio.Group
                onChange={(e) => setSelectedResume(e.target.value)}
                value={selectedResume}
                className="w-full space-y-3"
            >
                {mockResumes.map((resume) => (
                    <div key={resume.key} className="relative">
                        <Radio
                            value={resume.key}
                            className="w-full py-4 px-4 rounded-lg transition-all"
                            style={{
                                border:
                                    selectedResume === resume.key
                                        ? "1px solid #1890ff"
                                        : "1px solid #d9d9d9",
                                backgroundColor:
                                    selectedResume === resume.key ? "#e6f7ff" : "white",
                            }}
                        >
                            <div className="flex justify-between items-center w-full">
                                <span className="font-medium mr-4">
                                    {resume.name}
                                    {resume.status && (
                                        <Tag color="blue" className="ml-2">
                                            {resume.status}
                                        </Tag>
                                    )}
                                </span>
                                <EyeOutlined className="text-gray-500 hover:text-blue-500 cursor-pointer" />
                            </div>
                        </Radio>
                        {resume.isMain && (
                            <div className="absolute top-0 right-0 p-4 text-sm text-gray-500">
                                <span className="mr-3">
                                    Múi Đào <Tag color="blue">{resume.percent}%</Tag>
                                </span>
                                <span className="text-blue-500 cursor-pointer flex items-center">
                                    Hoàn thành CV của bạn <RightCircleOutlined className="ml-1" />
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </Radio.Group>

            <div className="pt-6">
                <Button type="primary" icon={<UploadOutlined />} className="bg-blue-600 hover:bg-blue-700">
                    Tải CV mới lên
                </Button>
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
            <p className="text-gray-500">
            </p>
        </Card>
    </div>
);

const MainContent = () => {
    const [selectedResume, setSelectedResume] = useState("main");

    const subTabs = [
        {
            key: "1",
            label: "Lợi mời ứng tuyển",
            children: <ContentLoiMoiUngTuyen
                selectedResume={selectedResume}
                setSelectedResume={setSelectedResume}
            />
        },
        { key: "2", label: "Việc đã ứng tuyển", children: "Nội dung Việc đã ứng tuyển" },
        { key: "3", label: "Việc đã lưu", children: "Nội dung Việc đã lưu" },
        { key: "4", label: "Việc đã xem", children: "Nội dung Việc đã xem" },
    ];

    return (
        <div className="mt-5">
            <Tabs defaultActiveKey="1" items={subTabs} />
        </div>
    );
};

function JobMana() {
    return (
        <div className="container mx-auto px-6 py-6 bg-gray-50 min-h-screen">
            <Row gutter={24}>
                <Col span={6}>
                    <JobManagementSidebar />
                </Col>
                <Col span={18}>
                    <MainContent />
                </Col>
            </Row>
        </div>
    );
}
export default JobMana;