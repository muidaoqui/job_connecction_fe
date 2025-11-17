import React from "react";
import {
  Card,
  Row,
  Col,
  Tag,
  Button,
  Table,
  Pagination,
  Upload,
} from "antd";
import {
  UploadOutlined,
  PlusOutlined,
  EditOutlined,
  DownloadOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  LinkOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";
import ProfileSidebar from "../../../components/customer/ProfileSidebar";
import { useResumeManagement } from "../../../hooks/useResumeManagement";
import { getProfile } from "../../../api/profileAPI";

const CVManaSidebar = ({ userName }) => (
  <ProfileSidebar userName={userName || "Người dùng"} />
);

const SERVER_BASE = "http://localhost:8080";

const columns = (onView, onDownload, onSetMain) => [
  {
    title: "Tên CV",
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => (
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-base">{text}</h4>
          {record.isMain && <Tag color="blue">CV chính</Tag>}
        </div>
        <p className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer">
          <LinkOutlined className="mr-1" /> Lưu vào hệ thống
        </p>
      </div>
    ),
  },
  {
    title: "Trạng thái hoàn thành",
    dataIndex: 'status',
    key: 'status',
    width: 280,
    render: (_, record) => (
      <div className="flex items-center">
        {record.isCompleted ? (
          <CheckCircleFilled className="text-green-500 mr-2" />
        ) : (
          <ClockCircleOutlined className="text-red-500 mr-2" />
        )}
        <span className="text-sm">{record.status || '—'}</span>
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
            <ClockCircleOutlined className="mr-1" /> {text || '—'}
        </div>
    )
  },
  {
    title: "Hành động",
    key: 'action',
    width: 200,
    render: (_, record) => (
      <div className="space-x-2 flex flex-wrap">
        <Button type="link" onClick={() => onView(record)} icon={<LinkOutlined />}>Xem</Button>
        <Button type="link" onClick={() => onDownload(record)} icon={<DownloadOutlined />}>Tải</Button>
        {!record.isMain && (
          <Button type="link" onClick={() => onSetMain(record)} className="text-blue-500">Chọn chính</Button>
        )}
      </div>
    ),
  },
];

const MainContent = () => {
  const { resumes, mainResume, loading, uploadNewResume, setMainResume } = useResumeManagement();
  const [profileName, setProfileName] = React.useState("");

  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getProfile();
        setProfileName(res.data?.name || res.data?.candidate?.name || "");
      } catch (err) {
        // ignore
      }
    };
    loadProfile();
  }, []);

  const onView = (rec) => {
    if (!rec?.path) return;
    const p = (rec.path || "").replace(/\\\\/g, "/");
    const url = p.startsWith("http") ? p : p.startsWith("/") ? `${SERVER_BASE}${p}` : `${SERVER_BASE}/${p}`;
    window.open(url, "_blank");
  };

  const onDownload = (rec) => {
    if (!rec?.path) return;
    const p = (rec.path || "").replace(/\\\\/g, "/");
    const url = p.startsWith("http") ? p : p.startsWith("/") ? `${SERVER_BASE}${p}` : `${SERVER_BASE}/${p}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = rec.name || '';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const onSetMain = async (rec) => {
    if (rec?.path) {
      await setMainResume(rec.path);
    }
  };

  const handleUpload = async (file) => {
    await uploadNewResume(file);
  };

  const tableData = resumes.map((r, idx) => ({
    key: r.id || idx,
    name: r.name,
    status: r.isMain ? 'CV chính' : 'Bản phụ',
    lastEdited: r.uploadedAt ? new Date(r.uploadedAt).toLocaleString() : '-',
    isCompleted: r.percent >= 100,
    path: r.path,
    isMain: r.isMain,
  }));

  return (
    <div className="mt-5">
      <div className="flex justify-end items-center mb-4 space-x-3">
        <Upload beforeUpload={() => false} showUploadList={false} accept=".doc,.docx,.pdf" onChange={(info) => handleUpload(info.file)}>
          <Button icon={<UploadOutlined />} className="border-blue-500 text-blue-500 hover:border-blue-700 hover:text-blue-700">Tải CV của bạn lên</Button>
        </Upload>
        <Button type="primary" icon={<PlusOutlined />} className="bg-blue-600 hover:bg-blue-700">Tạo CV (Phiên bản mới)</Button>
      </div>

      <Card bodyStyle={{ padding: 0 }} className="shadow-lg">
        <Table
          columns={columns(onView, onDownload, onSetMain)}
          dataSource={tableData}
          pagination={{ pageSize: 5, total: tableData.length, showSizeChanger: false }}
          rowKey="key"
          className="cv-management-table"
          loading={loading}
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
          <CVManaSidebar userName={null} />
        </Col>

        <Col span={18}>
          <MainContent />
        </Col>
      </Row>
    </div>
  );
}
export default CVMana;