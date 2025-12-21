import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Tag,
  Avatar,
  Input,
  Space,
  Popconfirm,
  notification,
  Segmented,
  Empty,
  Skeleton,
} from "antd";
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { format } from "date-fns";
import {
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  Bookmark,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { rejectJob, getAllJobs, approveJob } from "../../services/admin";
export default function AdminPendingJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");

  useEffect(() => {
    fetchJobs();
  }, []);

  const apiFetch = (path, options = {}) => {
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
      const data = await getAllJobs();
      setJobs(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      notification.error({
        message: "Không thể tải danh sách tin tuyển dụng",
        description: err?.response?.data?.message || "Lỗi kết nối server",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (jobId) => {
    setLoading(true);
    try {
      await approveJob(jobId);
      notification.success({
        message: "Đã duyệt tin tuyển dụng thành công",
      });
      fetchJobs();
    } catch (err) {
      notification.error({
        message: "Duyệt thất bại",
        description: err?.response?.data?.message || "Có lỗi xảy ra",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (jobId) => {
    setLoading(true);
    try {
      await rejectJob(jobId);
      notification.info({
        message: "Đã từ chối tin tuyển dụng",
      });
      fetchJobs();
    } catch (err) {
      notification.error({
        message: "Từ chối thất bại",
        description: err?.response?.data?.message || "Có lỗi xảy ra",
      });
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (record) => {
    setSelectedJob(record);
    setDetailVisible(true);
  };

  const filteredJobs = jobs.filter((j) => {
    if (statusFilter !== "all" && j.status !== statusFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (j.title || "").toLowerCase().includes(q) ||
      (j.companyId?.name || "").toLowerCase().includes(q) ||
      (j.location || "").toLowerCase().includes(q) ||
      (j.description || "").toLowerCase().includes(q)
    );
  });

  const columns = [
    {
      title: "Tin tuyển dụng",
      key: "job",
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <Avatar
            size={56}
            src={record.companyId?.logo}
            icon={<Building2 />}
            className="flex-shrink-0 border border-gray-200"
          />
          <div className="min-w-0">
            <div className="font-semibold text-base truncate">
              {record.title}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {record.companyId?.name}
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {record.location || "Không rõ"}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Thông tin",
      key: "info",
      width: 280,
      render: (_, record) => (
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span className="font-medium">
                {record.salary || "Thoả thuận"}
              </span>
            </span>
            <Tag color="blue">{record.jobType || "Full-time"}</Tag>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Bookmark className="w-3.5 h-3.5" />
              {record.saveCount || 0} lưu
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {record.createdAt
                ? format(new Date(record.createdAt), "dd/MM/yyyy")
                : "-"}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const config = {
          pending: { color: "orange", text: "Chờ duyệt" },
          approved: { color: "green", text: "Đã duyệt" },
          rejected: { color: "red", text: "Đã từ chối" },
        };
        const cfg = config[status] || config.pending;
        return <Tag color={cfg.color}>{cfg.text}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 240,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => openDetail(record)}
          >
            Chi tiết
          </Button>
          {record.status === "pending" && (
            <>
              <Popconfirm
                title="Duyệt tin tuyển dụng này?"
                onConfirm={() => handleApprove(record._id)}
                okText="Duyệt"
                cancelText="Huỷ"
              >
                <Button size="small" type="primary" icon={<CheckOutlined />}>
                  Duyệt
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Từ chối tin này?"
                description="Hành động này không thể hoàn tác"
                onConfirm={() => handleReject(record._id)}
                okText="Từ chối"
                cancelText="Huỷ"
                okButtonProps={{ danger: true }}
              >
                <Button size="small" danger icon={<CloseOutlined />}>
                  Từ chối
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Duyệt tin tuyển dụng
              </h1>
              <p className="text-gray-600 mt-2">
                Quản lý và duyệt các tin tuyển dụng đang chờ xử lý
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Segmented
                size="large"
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
                placeholder="Tìm kiếm tiêu đề, công ty, địa điểm..."
                prefix={<SearchOutlined className="text-gray-400" />}
                allowClear
                size="large"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-96"
              />

              <Button
                size="large"
                icon={<RefreshCw className={loading ? "animate-spin" : ""} />}
                onClick={fetchJobs}
                loading={loading}
              >
                Tải lại
              </Button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-8">
              <Skeleton active paragraph={{ rows: 8 }} />
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="p-16">
              <Empty
                description={
                  jobs.length === 0
                    ? "Chưa có tin tuyển dụng nào"
                    : "Không tìm thấy tin nào phù hợp với bộ lọc"
                }
              />
            </div>
          ) : (
            <Table
              columns={columns}
              dataSource={filteredJobs}
              rowKey="_id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} tin`,
              }}
              scroll={{ x: 1000 }}
              className="ant-table-custom"
            />
          )}
        </div>

        {/* Detail Modal */}
        <Modal
          open={detailVisible}
          title={false}
          onCancel={() => setDetailVisible(false)}
          footer={null}
          width={1000}
          closeIcon={null}
          className="top-8"
        >
          {selectedJob && (
            <div className="max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex gap-6">
                  <Avatar
                    size={100}
                    src={selectedJob.companyId?.logo}
                    icon={<Building2 />}
                    className="border-4 border-gray-100"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedJob.title}
                    </h2>
                    <h3 className="text-xl text-gray-700 mt-1">
                      {selectedJob.companyId?.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-3 text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedJob.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {selectedJob.salary || "Thoả thuận"}
                      </span>
                      <Tag color="blue">{selectedJob.jobType}</Tag>
                    </div>
                  </div>
                </div>

                <Tag
                  color={
                    selectedJob.status === "pending"
                      ? "orange"
                      : selectedJob.status === "approved"
                      ? "green"
                      : "red"
                  }
                  className="text-lg px-4 py-1"
                >
                  {selectedJob.status === "pending"
                    ? "Chờ duyệt"
                    : selectedJob.status === "approved"
                    ? "Đã duyệt"
                    : "Đã từ chối"}
                </Tag>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div>
                    <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-blue-600" />
                      Mô tả công việc
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-5 text-gray-700 whitespace-pre-wrap">
                      {selectedJob.description || "Không có mô tả"}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-3">
                      Yêu cầu ứng viên
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-5 text-gray-700 whitespace-pre-wrap">
                      {selectedJob.requirements || "Không có yêu cầu cụ thể"}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                    <h4 className="font-semibold text-lg mb-4">
                      Thông tin công ty
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-600">Ngành nghề:</span>
                        <p className="font-medium">
                          {selectedJob.companyId?.industry || "-"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Quy mô:</span>
                        <p className="font-medium">
                          {selectedJob.companyId?.size || "-"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Địa chỉ:</span>
                        <p className="font-medium">
                          {selectedJob.companyId?.address || "-"}
                        </p>
                      </div>
                      {selectedJob.companyId?.website && (
                        <a
                          href={selectedJob.companyId.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Trang web công ty →
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-semibold text-lg mb-4">Thống kê</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lượt lưu</span>
                        <span className="font-semibold">
                          {selectedJob.saveCount || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ngày đăng</span>
                        <span className="font-semibold">
                          {format(
                            new Date(selectedJob.createdAt),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 mt-10 pt-6 border-t">
                <Button size="large" onClick={() => setDetailVisible(false)}>
                  Đóng
                </Button>
                {selectedJob.status === "pending" && (
                  <>
                    <Popconfirm
                      title="Duyệt tin tuyển dụng này?"
                      onConfirm={() => {
                        handleApprove(selectedJob._id);
                        setDetailVisible(false);
                      }}
                      okText="Duyệt ngay"
                      okButtonProps={{ type: "primary" }}
                    >
                      <Button
                        size="large"
                        type="primary"
                        icon={<CheckOutlined />}
                      >
                        Duyệt tin
                      </Button>
                    </Popconfirm>
                    <Popconfirm
                      title="Từ chối tin này?"
                      description="Tin sẽ bị ẩn và không thể khôi phục"
                      onConfirm={() => {
                        handleReject(selectedJob._id);
                        setDetailVisible(false);
                      }}
                      okText="Từ chối"
                      okButtonProps={{ danger: true }}
                    >
                      <Button size="large" danger icon={<CloseOutlined />}>
                        Từ chối
                      </Button>
                    </Popconfirm>
                  </>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
