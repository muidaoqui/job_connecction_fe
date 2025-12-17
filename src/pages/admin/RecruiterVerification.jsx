import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Input,
  message,
  Card,
  Avatar,
  Descriptions,
  Image,
  Divider,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  UserOutlined,
} from "@ant-design/icons";

import {
  getPendingRecruiters,
  approveRecruiter,
  rejectRecruiter,
} from "../../services/admin";

export default function RecruiterVerification() {
  const [loading, setLoading] = useState(false);
  const [recruiters, setRecruiters] = useState([]);

  // Modal từ chối
  const [rejectModal, setRejectModal] = useState({
    open: false,
    id: null,
    note: "",
  });

  // Modal xem chi tiết
  const [detailModal, setDetailModal] = useState({
    open: false,
    data: null,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getPendingRecruiters();
      setRecruiters(data);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách tuyển dụng!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    try {
      await approveRecruiter(id);
      message.success("Duyệt thành công!");
      fetchData();
    } catch (err) {
      message.error("Lỗi khi duyệt!");
    }
  };

  const handleReject = async () => {
    const { id, note } = rejectModal;
    try {
      await rejectRecruiter(id, note);
      message.success("Đã từ chối!");
      setRejectModal({ open: false, id: null, note: "" });
      fetchData();
    } catch (err) {
      message.error("Lỗi khi từ chối!");
    }
  };

  const columns = [
    {
      title: "Nhà tuyển dụng",
      dataIndex: "fullName",
      render: (_, r) => (
        <div className="flex items-center gap-3">
          <Avatar size={45} icon={<UserOutlined />} />
          <div>
            <div className="font-semibold text-gray-800">{r.fullName}</div>
            <div className="text-gray-500 text-sm">{r.workEmail}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Vị trí",
      dataIndex: "position",
    },
    {
      title: "Công ty",
      dataIndex: ["verificationData", "companyName"],
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Mã số thuế",
      dataIndex: ["verificationData", "taxCode"],
    },
    {
      title: "Trạng thái",
      dataIndex: "verificationStatus",
      render: (status) => (
        <Tag color="orange" className="px-3 py-1 rounded-full">
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      render: (_, r) => (
        <div className="flex gap-3">
          <Button
            icon={<EyeOutlined />}
            onClick={() =>
              setDetailModal({ open: true, data: r.verificationData })
            }
          >
            Xem chi tiết
          </Button>

          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleApprove(r._id)}
          >
            Duyệt
          </Button>

          <Button
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => setRejectModal({ open: true, id: r._id, note: "" })}
          >
            Từ chối
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-10">
      <Card className="shadow-lg border rounded-xl">
        <h1 className="text-3xl font-bold mb-5 text-gray-800">
          Xác thực Nhà Tuyển Dụng
        </h1>
        <p className="text-gray-600 mb-6">
          Danh sách các nhà tuyển dụng đang chờ xét duyệt.
        </p>

        <Table
          rowKey="_id"
          columns={columns}
          dataSource={recruiters}
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Modal chi tiết */}
      <Modal
        title="Thông tin đăng ký xác thực"
        open={detailModal.open}
        footer={null}
        onCancel={() => setDetailModal({ open: false, data: null })}
        width={750}
      >
        {detailModal.data && (
          <div className="space-y-5">
            <Descriptions bordered column={2} size="middle">
              <Descriptions.Item label="Tên công ty">
                {detailModal.data.companyName}
              </Descriptions.Item>
              <Descriptions.Item label="Mã số thuế">
                {detailModal.data.taxCode}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {detailModal.data.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Website">
                {detailModal.data.website}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>
                {detailModal.data.address}
              </Descriptions.Item>
              {detailModal.data.note && (
                <Descriptions.Item label="Ghi chú" span={2}>
                  {detailModal.data.note}
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider>Hình ảnh xác thực</Divider>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="font-medium">Giấy phép kinh doanh</p>
                {detailModal.data.businessLicense ? (
                  <Image src={detailModal.data.businessLicense} />
                ) : (
                  <p className="text-gray-400">Không có</p>
                )}
              </div>

              <div>
                <p className="font-medium">CMND/CCCD mặt trước</p>
                {detailModal.data.idCardFront ? (
                  <Image src={detailModal.data.idCardFront} />
                ) : (
                  <p className="text-gray-400">Không có</p>
                )}
              </div>

              <div>
                <p className="font-medium">CMND/CCCD mặt sau</p>
                {detailModal.data.idCardBack ? (
                  <Image src={detailModal.data.idCardBack} />
                ) : (
                  <p className="text-gray-400">Không có</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal từ chối */}
      <Modal
        title="Từ chối yêu cầu xác thực"
        open={rejectModal.open}
        okText="Xác nhận từ chối"
        cancelText="Huỷ"
        onCancel={() => setRejectModal({ open: false, id: null, note: "" })}
        onOk={handleReject}
      >
        <p className="text-gray-600 mb-2">
          Nhập lý do từ chối (không bắt buộc):
        </p>
        <Input.TextArea
          rows={4}
          placeholder="Lý do từ chối..."
          value={rejectModal.note}
          onChange={(e) =>
            setRejectModal({ ...rejectModal, note: e.target.value })
          }
        />
      </Modal>
    </div>
  );
}
