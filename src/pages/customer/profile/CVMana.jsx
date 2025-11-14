import React from "react";
import {
  Card,
  Row,
  Col,
  Tag,
  Button,
  Switch,
  Table,
  Pagination,
  Menu,
  Progress,
} from "antd";
import {
  CheckCircleOutlined,
  UploadOutlined,
  PlusOutlined,
  EditOutlined,
  DownloadOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  LinkOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";

const CVManaSidebar = () => (
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

const cvData = [
  {
    key: '1',
    name: 'Đào Quí Mùi - Full Stack Web Developer',
    createdOn: 'TopDev',
    status: 'Software Engineer Intern / Thực tập sinh IT',
    lastEdited: '2025-09-17 20:55:49',
    isCompleted: true,
  },
  {
    key: '2',
    name: 'Đào Quí Mùi',
    createdOn: 'TopDev',
    status: 'Not yet applied for any position',
    lastEdited: '2025-09-15 17:52:14',
    isCompleted: false,
  },
];

const columns = [
  {
    title: "Tên CV",
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <div>
        <h4 className="font-medium text-base">{text}</h4>
        <p className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer">
          <LinkOutlined className="mr-1" /> Tạo trên {record.createdOn}
        </p>
      </div>
    ),
  },
  {
    title: "Trạng thái hoàn thành",
    dataIndex: 'status',
    key: 'status',
    width: 280,
    render: (text, record) => (
      <div className="flex items-center">
        {record.isCompleted ? (
          <CheckCircleFilled className="text-green-500 mr-2" />
        ) : (
          <ClockCircleOutlined className="text-red-500 mr-2" />
        )}
        <span className="text-sm">{text}</span>
      </div>
    ),
  },
  {
    title: "Chỉnh sửa lần cuối",
    dataIndex: 'lastEdited',
    key: 'lastEdited',
    width: 150,
    render: (text) => (
        <div className="flex items-center text-sm text-gray-600">
            <ClockCircleOutlined className="mr-1" /> {text}
        </div>
    )
  },
  {
    title: "Hành động",
    key: 'action',
    width: 100,
    render: () => (
      <div className="space-x-2 text-lg">
        <EditOutlined className="text-gray-500 cursor-pointer hover:text-blue-500" title="Chỉnh sửa" />
        <DownloadOutlined className="text-gray-500 cursor-pointer hover:text-green-500" title="Tải xuống" />
        <DeleteOutlined className="text-gray-500 cursor-pointer hover:text-red-500" title="Xóa" />
      </div>
    ),
  },
];

const MainContent = () => {
    
  return (
    <div className="mt-5">
      
      <div className="flex justify-end items-center mb-4 space-x-3">
        <Button icon={<UploadOutlined />} className="border-blue-500 text-blue-500 hover:border-blue-700 hover:text-blue-700">
          Tải CV của bạn lên
        </Button>
        <Button type="primary" icon={<PlusOutlined />} className="bg-blue-600 hover:bg-blue-700">
          Tạo CV (Phiên bản mới)
        </Button>
        <a href="#" className="text-sm text-gray-600 hover:text-blue-500">
          Tạo CV (Phiên bản cũ) &rarr;
        </a>
      </div>

      <Card bodyStyle={{ padding: 0 }} className="shadow-lg">
        <Table
          columns={columns}
          dataSource={cvData}
          pagination={{ 
            pageSize: 5, 
            total: cvData.length,
            showSizeChanger: false,
            itemRender: (current, type, originalElement) => {
                if (type === 'page' && current === 1) {
                    return <Button type="primary" shape="circle" size="small">{current}</Button>;
                }
                if (type === 'page') {
                    return <Button shape="circle" size="small">{current}</Button>;
                }
                return originalElement;
            },
            className: 'flex justify-center my-3'
          }}
          rowKey="key"
          className="cv-management-table"
        />
      </Card>
    </div>
  );
};

// --- 3. Component Chính CVMana ---
function CVMana() {
  return (
    <div className="container mx-auto px-6 py-6 bg-gray-50 min-h-screen">
      <Row gutter={24}>
        <Col span={6}>
          <CVManaSidebar />
        </Col>

        <Col span={18}>
          <MainContent />
        </Col>
      </Row>
    </div>
  );
}
export default CVMana;