import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Tag,
  Avatar,
  Image,
  Input,
  Space,
  Popconfirm,
  notification,
  Spin,
  Segmented,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";

// AdminPendingJobs.jsx
// - Single-file React component using antd + Tailwind CSS
// - Drop into your React app (e.g. src/pages/admin/AdminPendingJobs.jsx)
// - Requirements: antd and tailwind configured in your project
// - Assumptions: API endpoints exist:
//     GET  /api/jobs/pending            -> list of pending jobs
//     POST /api/jobs/:id/approve        -> approve a job (returns updated job)
//     POST /api/jobs/:id/reject         -> reject a job (optionally with reason)
// Adjust endpoints/headers as needed.

export default function AdminPendingJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");

  useEffect(() => {
    fetchJobs();
  }, []);

  const apiFetch = (path, options = {}) => {
    // helper to attach token if present
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };
    if (token) headers.Authorization = `Bearer ${token}`;
    return fetch(path, { ...options, headers });
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("http://localhost:8080/api/admin/jobs");
      if (!res.ok) throw new Error("Failed to fetch pending jobs");
      const json = await res.json();
      // assume payload shape { success: true, data: [...] }
      setJobs(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Không thể tải danh sách công việc",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (jobId) => {
    setLoading(true);
    try {
      const res = await apiFetch(
        `http://localhost:8080/api/admin/jobs/${jobId}/approve`,
        {
          method: "PUT",
        }
      );
      if (!res.ok) throw new Error("Approve failed");
      notification.success({ message: "Đã duyệt tin tuyển dụng" });
      await fetchJobs();
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Duyệt thất bại",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (jobId) => {
    setLoading(true);
    try {
      const res = await apiFetch(
        `http://localhost:8080/api/admin/jobs/${jobId}/reject`,
        {
          method: "PUT",
        }
      );
      if (!res.ok) throw new Error("Reject failed");
      notification.info({ message: "Đã từ chối tin tuyển dụng" });
      await fetchJobs();
    } catch (err) {
      console.error(err);
      notification.error({
        message: "Từ chối thất bại",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (record) => {
    setSelectedJob(record);
    setDetailVisible(true);
  };

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={48}
            src={record.companyId?.logo}
            alt={record.companyId?.name}
          />
          <div className="flex flex-col leading-tight">
            <div className="font-medium">{text}</div>
            <div className="text-sm text-gray-500">
              {record.companyId?.name}
            </div>
          </div>
        </div>
      ),
      sorter: (a, b) => (a.title || "").localeCompare(b.title || ""),
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
      width: 160,
    },
    {
      title: "Hình thức",
      dataIndex: "jobType",
      key: "jobType",
      width: 120,
      render: (t) => <Tag>{t || "-"}</Tag>,
    },
    {
      title: "Lương",
      dataIndex: "salary",
      key: "salary",
      width: 160,
      render: (s) => s || "-",
    },
    {
      title: "Người đăng",
      dataIndex: ["recruiterId", "position"],
      key: "recruiter",
      width: 180,
      render: (_, record) => (
        <div className="flex flex-col">
          <div className="text-sm">{record.recruiterId?.position || "-"}</div>
          <div className="text-xs text-gray-500">
            Followers: {record.recruiterId?.followers ?? 0}
          </div>
        </div>
      ),
    },
    {
      title: "Lượt lưu",
      dataIndex: "saveCount",
      key: "saveCount",
      width: 100,
      sorter: (a, b) => (a.saveCount || 0) - (b.saveCount || 0),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (s) => {
        const color =
          s === "pending" ? "orange" : s === "approved" ? "green" : "red";
        return <Tag color={color}>{s}</Tag>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (d) => (d ? new Date(d).toLocaleString() : "-"),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    },
    {
      title: "Hành động",
      key: "action",
      width: 220,
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => openDetail(record)}>
            Xem
          </Button>

          {record.status !== "approved" && (
            <Popconfirm
              title="Bạn chắc chắn muốn duyệt tin này?"
              onConfirm={() => handleApprove(record._id)}
            >
              <Button icon={<CheckOutlined />} type="primary">
                Duyệt
              </Button>
            </Popconfirm>
          )}

          {record.status !== "rejected" && (
            <Popconfirm
              title="Từ chối tin này?"
              onConfirm={() => handleReject(record._id)}
            >
              <Button icon={<CloseOutlined />} danger>
                Từ chối
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const filteredJobs = jobs.filter((j) => {
    // Lọc theo trạng thái
    if (statusFilter !== "all" && j.status !== statusFilter) return false;

    // Lọc theo search
    if (!search) return true;
    const q = search.toLowerCase();

    return (
      (j.title || "").toLowerCase().includes(q) ||
      (j.description || "").toLowerCase().includes(q) ||
      (j.companyId?.name || "").toLowerCase().includes(q) ||
      (j.location || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-semibold">Duyệt tin tuyển dụng</h1>

        <div className="flex items-center gap-3">
          <Segmented
            options={[
              { label: "Chờ duyệt", value: "pending" },
              { label: "Đã duyệt", value: "approved" },
              { label: "Đã từ chối", value: "rejected" },
              { label: "Tất cả", value: "all" },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
          />

          <Input
            placeholder="Tìm kiếm theo tiêu đề / công ty / địa điểm"
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80"
            allowClear
          />

          <Button onClick={fetchJobs}>Tải lại</Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredJobs}
            rowKey={(r) => r._id}
            pagination={{ pageSize }}
            onChange={(pagination) => setPageSize(pagination.pageSize || 10)}
          />
        )}
      </div>

      <Modal
        visible={detailVisible}
        title={selectedJob?.title}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={900}
      >
        {selectedJob ? (
          <div className="space-y-4">
            <div className="flex gap-4">
              <Image
                width={120}
                src={selectedJob.companyId?.logo}
                preview={false}
              />
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedJob.companyId?.name}
                </h3>
                <div className="text-sm text-gray-600">
                  {selectedJob.companyId?.industry} •{" "}
                  {selectedJob.companyId?.size}
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {selectedJob.companyId?.address}
                </div>
                <a
                  href={selectedJob.companyId?.website}
                  target="_blank"
                  rel="noreferrer"
                  className="block mt-2 underline"
                >
                  Website
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-medium">Mô tả</h4>
              <p className="whitespace-pre-wrap">{selectedJob.description}</p>
            </div>

            <div>
              <h4 className="font-medium">Yêu cầu</h4>
              <p className="whitespace-pre-wrap">{selectedJob.requirements}</p>
            </div>

            <div className="flex gap-4">
              <div>
                <h4 className="font-medium">Lương</h4>
                <div>{selectedJob.salary}</div>
              </div>

              <div>
                <h4 className="font-medium">Địa điểm</h4>
                <div>{selectedJob.location}</div>
              </div>

              <div>
                <h4 className="font-medium">Trạng thái</h4>
                <Tag>{selectedJob.status}</Tag>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <Button onClick={() => setDetailVisible(false)}>Đóng</Button>

              {selectedJob.status !== "approved" && (
                <Popconfirm
                  title="Duyệt tin này?"
                  onConfirm={() => handleApprove(selectedJob._id)}
                >
                  <Button icon={<CheckOutlined />} type="primary">
                    Duyệt
                  </Button>
                </Popconfirm>
              )}

              {selectedJob.status !== "rejected" && (
                <Popconfirm
                  title="Từ chối tin này?"
                  onConfirm={() => handleReject(selectedJob._id)}
                >
                  <Button icon={<CloseOutlined />} danger>
                    Từ chối
                  </Button>
                </Popconfirm>
              )}
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
