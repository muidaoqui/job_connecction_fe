import React, { useEffect, useState } from "react";
import { Table, Input, Tag, Card, Segmented, Modal, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  getAllUsers,
  getUserById,
  toggleUserStatus,
} from "../../services/admin";
export default function UsersPage() {
  const { confirm } = Modal;
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // lọc role
  const [statusFilter, setStatusFilter] = useState("all"); // lọc trạng thái

  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  const handleEdit = async (record) => {
    setLoadingUser(true);
    setOpenModal(true);

    try {
      const json = await getUserById(record._id); // gọi API
      setSelectedUser(json);
      console.log(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingUser(false);
    }
  };

  const handleToggleLock = async (record) => {
    try {
      const res = await toggleUserStatus(record._id);
      const updatedUser = res.data; // nếu dùng Axios trả về {data: updatedUser}

      // Cập nhật lại list trên FE
      setUsers((prev) =>
        prev.map((u) =>
          u._id === record._id ? { ...u, status: updatedUser.status } : u
        )
      );

      setFiltered((prev) =>
        prev.map((u) =>
          u._id === record._id ? { ...u, status: updatedUser.status } : u
        )
      );
    } catch (err) {
      console.error("Toggle status failed:", err);
    }
  };
  // Fetch API
  useEffect(() => {
    async function fetchUsers() {
      try {
        const json = await getAllUsers();
        setUsers(json.data || []);
        setFiltered(json.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);
  // Search + Filter by Role
  // useEffect(() => {
  //   const keyword = search.toLowerCase();

  //   const result = users.filter((u) => {
  //     const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
  //     const matchSearch =
  //       fullName.includes(keyword) || u.role.toLowerCase().includes(keyword);

  //     const matchRole = roleFilter === "all" ? true : u.role === roleFilter;

  //     return matchSearch && matchRole;
  //   });

  //   setFiltered(result);
  // }, [search, roleFilter, users]);
  useEffect(() => {
    const keyword = search.toLowerCase();

    const result = users.filter((u) => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      const matchSearch =
        fullName.includes(keyword) || u.role.toLowerCase().includes(keyword);

      const matchRole = roleFilter === "all" ? true : u.role === roleFilter;
      const matchStatus =
        statusFilter === "all" ? true : u.status === statusFilter; // <-- thêm đây

      return matchSearch && matchRole && matchStatus;
    });

    setFiltered(result);
  }, [search, roleFilter, statusFilter, users]);

  const colorMap = {
    admin: "#ff4d4f", // đỏ
    recruiter: "#1677ff", // xanh lam
    candidate: "#52c41a", // xanh lá
  };

  const columns = [
    {
      title: "Họ và Tên",
      dataIndex: "firstName",
      render: (_, record) => (
        <span className="font-medium">
          {record.lastName} {record.firstName}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      render: (role) => {
        const colorMap = {
          admin: "red",
          recruiter: "blue",
          candidate: "green",
        };
        return (
          <Tag color={colorMap[role] || "default"} className="capitalize">
            {role}
          </Tag>
        );
      },
    },
    {
      title: "Xác thực email",
      dataIndex: "emailVerified",
      render: (val) =>
        val ? <Tag color="green">Yes</Tag> : <Tag color="orange">No</Tag>,
    },
    {
      title: "Trạng thái tài khoản",
      dataIndex: "status",
      render: (status) =>
        status === "banned" ? (
          <Tag color="red">Banned</Tag>
        ) : (
          <Tag color="green">Active</Tag>
        ),
    },

    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-4">
          <span
            onClick={() => handleEdit(record)}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            View / Edit
          </span>

          <span
            onClick={() => handleToggleLock(record)}
            className="text-orange-600 cursor-pointer hover:underline"
          >
            {record.status === "banned" ? "Unlock" : "Lock"}
          </span>

          <span className="text-red-600 cursor-pointer hover:underline">
            Delete
          </span>
        </div>
      ),
    },
  ];

  const renderCandidateModal = () => (
    <div className="flex flex-col gap-6">
      <h3 className="text-lg font-semibold text-gray-700">User Information</h3>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="font-medium">First Name</label>
          <Input defaultValue={selectedUser.firstName} />
        </div>

        <div>
          <label className="font-medium">Last Name</label>
          <Input defaultValue={selectedUser.lastName} />
        </div>

        <div>
          <label className="font-medium">Email</label>
          <Input defaultValue={selectedUser.email} disabled />
        </div>

        <div>
          <label className="font-medium">Phone</label>
          <Input defaultValue={selectedUser.phoneNumber} />
        </div>
      </div>

      <hr className="my-2" />

      <h3 className="text-lg font-semibold text-gray-700">Candidate Profile</h3>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="font-medium">Date of Birth</label>
          <Input
            type="date"
            defaultValue={selectedUser.profile?.date_of_birth?.slice(0, 10)}
          />
        </div>

        <div>
          <label className="font-medium">Gender</label>
          <select
            className="border rounded-lg px-3 py-2 w-full"
            defaultValue={selectedUser.profile?.gender}
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="font-medium">Address</label>
          <Input defaultValue={selectedUser.profile?.address} />
        </div>
      </div>

      <div>
        <label className="font-medium">Profile Summary</label>
        <Input.TextArea
          rows={3}
          defaultValue={selectedUser.profile?.profile_summary}
        />
        <label className="font-medium mt-2 block">Resume</label>

        {selectedUser.profile?.resume_path ? (
          <a
            href={`http://localhost:8080/${selectedUser.profile.resume_path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {selectedUser.profile.resume_path}
          </a>
        ) : (
          <p className="text-gray-500 italic">No resume uploaded</p>
        )}
      </div>

      <button className="bg-blue-600 text-white rounded-lg py-2 mt-4">
        Save Changes
      </button>
    </div>
  );

  const renderRecruiterModal = () => (
    <div className="flex flex-col gap-6">
      <h3 className="text-lg font-semibold text-gray-700">
        Recruiter Information
      </h3>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="font-medium">Company Name</label>
          <Input defaultValue={selectedUser.recruiter?.companyName} />
        </div>

        <div>
          <label className="font-medium">Position</label>
          <Input defaultValue={selectedUser.recruiter?.position} />
        </div>

        <div>
          <label className="font-medium">Email</label>
          <Input defaultValue={selectedUser.email} disabled />
        </div>

        <div>
          <label className="font-medium">Phone</label>
          <Input defaultValue={selectedUser.phoneNumber} />
        </div>

        <div className="col-span-2">
          <label className="font-medium">Company Address</label>
          <Input defaultValue={selectedUser.recruiter?.companyAddress} />
        </div>
      </div>

      <div>
        <label className="font-medium">About Company</label>
        <Input.TextArea
          rows={3}
          defaultValue={selectedUser.recruiter?.companyDescription}
        />
      </div>

      <button className="bg-blue-600 text-white rounded-lg py-2 mt-4">
        Save Changes
      </button>
    </div>
  );

  return (
    <Card className="shadow p-4 rounded-xl bg-white h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">User Management</h2>

        <div className="flex gap-4">
          <Segmented
            options={[
              { label: "All", value: "all" },
              { label: "Active", value: "active" },
              { label: "Banned", value: "banned" },
              { label: "Inactive", value: "inactive" },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          {/* Search input */}
          <Input
            placeholder="Search by name or role..."
            prefix={<SearchOutlined />}
            className="w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Role filter */}
          <Segmented
            options={[
              { label: "Tất cả", value: "all" },
              { label: "Quản trị viên", value: "admin" },
              { label: "Nhà tuyển dụng", value: "recruiter" },
              { label: "Ứng viên", value: "candidate" },
            ]}
            value={roleFilter}
            onChange={setRoleFilter}
          />
        </div>
      </div>

      {/* Table auto full height */}
      <div className="flex-1 overflow-auto">
        <Table
          columns={columns}
          dataSource={filtered}
          loading={loading}
          rowKey={(record) => record._id}
          pagination={{ pageSize: 8 }}
        />
      </div>

      <Modal
        title={`View / Edit ${
          selectedUser?.role === "candidate" ? "Candidate" : "Recruiter"
        }`}
        open={openModal}
        onCancel={() => setOpenModal(false)}
        width="80%"
        footer={null}
        className="rounded-xl"
      >
        {loadingUser || !selectedUser ? (
          <p className="text-center py-4">Loading...</p>
        ) : (
          <>
            {selectedUser.role === "candidate"
              ? renderCandidateModal()
              : renderRecruiterModal()}
          </>
        )}
      </Modal>
    </Card>
  );
}
