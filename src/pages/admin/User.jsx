import React, { useEffect, useState } from "react";
import { Table, Input, Tag, Card, Segmented } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all"); // <-- lọc role

  // Fetch API
  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/admin/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const json = await res.json();
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
  useEffect(() => {
    const keyword = search.toLowerCase();

    const result = users.filter((u) => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      const matchSearch =
        fullName.includes(keyword) || u.role.toLowerCase().includes(keyword);

      const matchRole = roleFilter === "all" ? true : u.role === roleFilter;

      return matchSearch && matchRole;
    });

    setFiltered(result);
  }, [search, roleFilter, users]);

  const colorMap = {
    admin: "#ff4d4f", // đỏ
    recruiter: "#1677ff", // xanh lam
    candidate: "#52c41a", // xanh lá
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "firstName",
      render: (_, record) => (
        <span className="font-medium">
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
    },
    {
      title: "Role",
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
      title: "Email Verified",
      dataIndex: "emailVerified",
      render: (val) =>
        val ? <Tag color="green">Yes</Tag> : <Tag color="orange">No</Tag>,
    },

    // ⭐⭐⭐ Thêm cột hành động
    {
      title: "Actions",
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
            {record.isLocked ? "Unlock" : "Lock"}
          </span>

          <span
            onClick={() => handleDelete(record)}
            className="text-red-600 cursor-pointer hover:underline"
          >
            Delete
          </span>
        </div>
      ),
    },
  ];

  return (
    <Card className="shadow p-4 rounded-xl bg-white h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">User Management</h2>

        <div className="flex gap-4">
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
              { label: "All", value: "all" },
              { label: "Admin", value: "admin" },
              { label: "Recruiter", value: "recruiter" },
              { label: "Candidate", value: "candidate" },
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
    </Card>
  );
}
