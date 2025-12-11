import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Tag,
  Button,
  Table,
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
import { openProtectedFile } from "../../../utils/fileHelpers";
import Modal from "../../../components/Modal"; // import Modal

const CVManaSidebar = ({ userName }) => (
  <ProfileSidebar userName={userName || "Người dùng"} />
);

const SERVER_BASE = `${import.meta.env.VITE_API_URL}`;

const columns = (onView, onDownload, onSetMain, onSpellCheck) => [
  {
    title: "Tên CV",
    dataIndex: 'name',
    key: 'name',
    width: 200,
    render: (text, record) => (
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-base">{text}</h4>
          {/* {record.isMain && <Tag color="blue" >CV chính</Tag>} */}
        </div>
        <p className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer">
          <LinkOutlined className="mr-1" /> Lưu vào hệ thống
        </p>
      </div>
    ),
  },
  {
    title: "Trạng thái",
    dataIndex: 'status',
    key: 'status',
    width: 100,
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
    width: 200,
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
      <div className="space-x-4 flex flex-wrap">
        <Button type="link" onClick={() => onView(record)} icon={<LinkOutlined />}>Xem</Button>
        <Button type="link" onClick={() => onDownload(record)} icon={<DownloadOutlined />}>Tải</Button>
        <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
        {!record.isMain && (
          <Button type="link" onClick={() => onSetMain(record)} className="text-blue-500">Chọn chính</Button>
        )}
        <Button type="link" icon={<CheckCircleFilled />} onClick={() => onSpellCheck(record)}>
          Kiểm tra chính tả
        </Button>
      </div>
    ),
  },
];

const MainContent = () => {
  const { resumes, mainResume, loading, uploadNewResume, setMainResume } = useResumeManagement();
  const [profileName, setProfileName] = React.useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState("");
  const [selectedCV, setSelectedCV] = useState(null);

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
    openProtectedFile(rec.path, false).catch(() => {});
  };

  const onDownload = (rec) => {
    if (!rec?.path) return;
    openProtectedFile(rec.path, true).catch(() => {});
  };

  const onSetMain = async (rec) => {
    if (rec?.path) {
      await setMainResume(rec.path);
    }
  };

  const handleUpload = async (file) => {
    await uploadNewResume(file);
  };

  // Hiển thị modal văn bản trước khi kiểm tra chính tả
  const onSpellCheck = (rec) => {
    setSelectedCV(rec);
    setModalText(rec.name); // hoặc lấy nội dung CV nếu có
    setModalOpen(true);
  };

  const handleSpellCheck = () => {
    // Thực hiện kiểm tra chính tả ở đây (gọi API hoặc xử lý)
    setModalOpen(false);
    // ...thêm logic kiểm tra chính tả...
  };

  const tableData = resumes.map((r, idx) => ({
    key: r.id || idx,
    name: r.name,
    status: r.isMain ? 'CV chính' : 'Bản phụ',
    lastEdited: r.uploadedAt ? new Date(r.uploadedAt).toLocaleString() : '-',
    isCompleted: r.percent >= 100,
    path: r.path,
    isMain: r.isMain,
    content: r.content || "", // nếu có nội dung CV
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
          columns={columns(onView, onDownload, onSetMain, onSpellCheck)}
          dataSource={tableData}
          pagination={{ pageSize: 5, total: tableData.length, showSizeChanger: false }}
          rowKey="key"
          className="cv-management-table"
          loading={loading}
        />
      </Card>

      {/* Modal hiển thị văn bản trước khi kiểm tra chính tả */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Xem trước văn bản CV"
        width={600}
      >
        <div className="mb-4">
          <div className="font-semibold mb-2">Tên CV: {selectedCV?.name}</div>
          <div className="bg-gray-50 border rounded p-3 max-h-80 overflow-auto text-gray-800 whitespace-pre-line">
            {selectedCV?.content || "Không có nội dung hiển thị."}
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={() => setModalOpen(false)}>Đóng</Button>
          <Button type="primary" onClick={handleSpellCheck}>Kiểm tra chính tả</Button>
        </div>
      </Modal>
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