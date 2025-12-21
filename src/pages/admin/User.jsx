import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Input,
  Tag,
  Card,
  Segmented,
  Modal,
  Button,
  Avatar,
  Typography,
  Space,
  Divider,
  Descriptions,
  Spin,
  Empty,
} from "antd";
import {
  SearchOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  getAllUsers,
  getUserById,
  toggleUserStatus,
} from "../../services/admin";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Title, Text } = Typography;

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // Fetch all users
  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data } = await getAllUsers();
        setUsers(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Filter logic with useMemo for performance
  const filteredUsers = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return users.filter((u) => {
      const fullName = `${u.lastName} ${u.firstName}`.toLowerCase();
      const matchSearch =
        !keyword ||
        fullName.includes(keyword) ||
        u.email.toLowerCase().includes(keyword) ||
        u.role.toLowerCase().includes(keyword);

      const matchRole = roleFilter === "all" || u.role === roleFilter;
      const matchStatus = statusFilter === "all" || u.status === statusFilter;

      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  useEffect(() => {
    setFiltered(filteredUsers);
  }, [filteredUsers]);

  const handleEdit = async (record) => {
    setLoadingUser(true);
    setEditModalOpen(true);
    try {
      const { data } = await getUserById(record._id);
      setSelectedUser(data);
    } catch (err) {
      console.error(err);
      Modal.error({
        title: "Lỗi",
        content: "Không thể tải thông tin người dùng",
      });
    } finally {
      setLoadingUser(false);
    }
  };

  const handleToggleLock = async (record) => {
    try {
      const { data: updatedUser } = await toggleUserStatus(record._id);

      setUsers((prev) =>
        prev.map((u) =>
          u._id === record._id ? { ...u, status: updatedUser.status } : u
        )
      );
      toast.success("Cập nhật trạng thái tài khoản thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật trạng thái tài khoản thất bại!");
    }
  };

  const confirmLockUser = (user) => {
    setSelectedUser(user);
    setConfirmModalOpen(true);
  };

  const handleCancel = () => {
    setConfirmModalOpen(false);
    setSelectedUser(null);
  };

  const handleConfirm = async () => {
    if (!selectedUser) return;
    await handleToggleLock(selectedUser);
    handleCancel();
  };

  // 🔴 DÒNG BẮT BUỘC
  const isBanned = selectedUser?.status === "banned";

  const roleTagColor = (role) => {
    switch (role) {
      case "admin":
        return "volcano";
      case "recruiter":
        return "blue";
      case "candidate":
        return "green";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Người dùng",
      key: "name",
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} className="bg-gray-400" />
          <div>
            <div className="font-medium">
              {record.lastName} {record.firstName}
            </div>
            <Text type="secondary" className="text-xs">
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      render: (text) => text || <Text type="secondary">—</Text>,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      render: (role) => (
        <Tag color={roleTagColor(role)} className="capitalize">
          {role === "recruiter"
            ? "Nhà tuyển dụng"
            : role === "candidate"
            ? "Ứng viên"
            : role}
        </Tag>
      ),
    },
    {
      title: "Email xác thực",
      dataIndex: "emailVerified",
      render: (val) => (
        <Tag color={val ? "success" : "warning"}>
          {val ? "Đã xác thực" : "Chưa xác thực"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "banned" ? "error" : "success"}>
          {status === "banned" ? "Bị khóa" : "Hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space split={<Divider type="vertical" />}>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-blue-600 p-0"
          >
            Chi tiết
          </Button>
          <Button
            type="link"
            icon={
              record.status === "banned" ? <UnlockOutlined /> : <LockOutlined />
            }
            onClick={() => confirmLockUser(record)}
            className={
              record.status === "banned"
                ? "text-green-600 p-0"
                : "text-orange-600 p-0"
            }
          >
            {record.status === "banned" ? "Mở khóa" : "Khóa"}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card className="h-full rounded-2xl shadow-lg border-0">
      <div className="space-y-6">
        {/* Header & Filters */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl">
          <Title level={3} className="mb-6 !text-gray-800">
            Quản lý người dùng
          </Title>

          <div className="grid grid-cols-12 gap-6">
            {/* Status Filter */}
            <div className="col-span-4">
              <Text className="block mb-2 font-medium text-gray-700">
                Trạng thái
              </Text>
              <Segmented
                block
                options={[
                  { label: "Tất cả", value: "all" },
                  { label: "Hoạt động", value: "active" },
                  { label: "Bị khóa", value: "banned" },
                  { label: "Chưa kích hoạt", value: "inactive" },
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
              />
            </div>

            {/* Role Filter */}
            <div className="col-span-4">
              <Text className="block mb-2 font-medium text-gray-700">
                Vai trò
              </Text>
              <Segmented
                block
                options={[
                  { label: "Tất cả", value: "all" },
                  { label: "Admin", value: "admin" },
                  { label: "Nhà tuyển dụng", value: "recruiter" },
                  { label: "Ứng viên", value: "candidate" },
                ]}
                value={roleFilter}
                onChange={setRoleFilter}
              />
            </div>

            {/* Search */}
            <div className="col-span-4">
              <Text className="block mb-2 font-medium text-gray-700">
                Tìm kiếm
              </Text>
              <Input
                placeholder="Tên, email, vai trò..."
                prefix={<SearchOutlined />}
                allowClear
                size="large"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={filtered}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10, showSizeChanger: true }}
          locale={{ emptyText: <Empty description="Không có dữ liệu" /> }}
          className="shadow-sm"
        />
      </div>

      {/* Edit Modal */}
      <Modal
        title={
          <Title level={4}>
            {selectedUser?.role === "candidate"
              ? "Chi tiết ứng viên"
              : "Chi tiết nhà tuyển dụng"}
          </Title>
        }
        open={editModalOpen}
        onCancel={() => {
          setEditModalOpen(false);
          setSelectedUser(null);
        }}
        footer={null}
        width={900}
        destroyOnClose
      >
        {loadingUser ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : !selectedUser ? (
          <Empty />
        ) : (
          <div className="space-y-8">
            {/* Avatar + Basic Info */}
            <div className="flex items-center gap-6">
              <Avatar
                size={80}
                icon={<UserOutlined />}
                className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-3xl"
              />
              <div>
                <Title level={4} className="!mt-0">
                  {selectedUser.lastName} {selectedUser.firstName}
                </Title>
                <Text type="secondary">{selectedUser.email}</Text>
              </div>
            </div>

            <Divider />

            {/* Common User Info */}
            <Descriptions bordered column={2} title="Thông tin chung">
              <Descriptions.Item label="Họ">
                {selectedUser.lastName}
              </Descriptions.Item>
              <Descriptions.Item label="Tên">
                {selectedUser.firstName}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {selectedUser.email}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedUser.phoneNumber || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Vai trò">
                <Tag
                  color={roleTagColor(selectedUser.role)}
                  className="capitalize"
                >
                  {selectedUser.role === "recruiter"
                    ? "Nhà tuyển dụng"
                    : selectedUser.role === "candidate"
                    ? "Ứng viên"
                    : "Admin"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={selectedUser.status === "banned" ? "error" : "success"}
                >
                  {selectedUser.status === "banned" ? "Bị khóa" : "Hoạt động"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            {/* Role-specific Info */}
            {selectedUser.role === "candidate" && selectedUser.profile && (
              <>
                <Title level={5}>Hồ sơ ứng viên</Title>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="Ngày sinh">
                    {selectedUser.profile.date_of_birth?.slice(0, 10) || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giới tính">
                    {selectedUser.profile.gender === "male"
                      ? "Nam"
                      : selectedUser.profile.gender === "female"
                      ? "Nữ"
                      : "Khác"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ" span={2}>
                    {selectedUser.profile.address || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tóm tắt hồ sơ" span={2}>
                    {selectedUser.profile.profile_summary || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="CV" span={2}>
                    {selectedUser.profile.resume_path ? (
                      <a
                        href={`http://localhost:8080/${selectedUser.profile.resume_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {selectedUser.profile.resume_path.split("/").pop()}
                      </a>
                    ) : (
                      <Text type="secondary">Chưa tải lên</Text>
                    )}
                  </Descriptions.Item>
                </Descriptions>
              </>
            )}

            {selectedUser.role === "recruiter" && selectedUser.recruiter && (
              <>
                <Title level={5}>Thông tin nhà tuyển dụng</Title>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="Công ty">
                    {selectedUser.recruiter.companyName || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Chức vụ">
                    {selectedUser.recruiter.position || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ công ty" span={2}>
                    {selectedUser.recruiter.companyAddress || "—"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Giới thiệu công ty" span={2}>
                    {selectedUser.recruiter.companyDescription || "—"}
                  </Descriptions.Item>
                </Descriptions>
              </>
            )}

            <div className="flex justify-end gap-3">
              <Button onClick={() => setEditModalOpen(false)}>Hủy</Button>
              <Button type="primary" className="bg-blue-600">
                Lưu thay đổi
              </Button>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        open={confirmModalOpen}
        title={isBanned ? "Mở khóa tài khoản" : "Khóa tài khoản"}
        onOk={handleConfirm}
        onCancel={handleCancel}
        okText={isBanned ? "Mở khóa" : "Khóa"}
        cancelText="Hủy"
        okButtonProps={{ danger: !isBanned }}
        destroyOnClose
      >
        <Typography.Text>
          Bạn có chắc chắn muốn{" "}
          <Typography.Text strong>
            {isBanned ? "mở khóa" : "khóa"}
          </Typography.Text>{" "}
          tài khoản của{" "}
          <Typography.Text strong>
            {selectedUser?.lastName} {selectedUser?.firstName}
          </Typography.Text>
          ?
        </Typography.Text>
      </Modal>
    </Card>
  );
}
