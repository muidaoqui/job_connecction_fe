import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Form,
  Input,
  Upload,
  Button,
  message,
  Modal,
  Result,
  Spin,
} from "antd";
import {
  UploadOutlined,
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  ClockCircleTwoTone,
} from "@ant-design/icons";

export default function RecruiterVerification() {
  const API = import.meta.env.VITE_API_URL;
  const API_URL = `${API}/api/admin`;
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [recruiter, setRecruiter] = useState(null);
  const [fetching, setFetching] = useState(true);

  /* ===========================
     Fetch recruiter status
  ============================ */
  const fetchRecruiterStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API_URL}/recruiter/${user._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setRecruiter(res.data);
    } catch (err) {
      setRecruiter(null);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchRecruiterStatus();
  }, []);

  /* ===========================
     Submit verification
  ============================ */
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("companyName", values.companyName);
      formData.append("taxCode", values.taxCode);
      formData.append("phone", values.phone);
      formData.append("address", values.address);
      if (values.website) formData.append("website", values.website);

      formData.append(
        "businessLicense",
        values.businessLicense[0].originFileObj
      );
      formData.append("idCardFront", values.idCardFront[0].originFileObj);
      formData.append("idCardBack", values.idCardBack[0].originFileObj);

      await axios.post(`${API_URL}/verify/${user._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      message.success("Gửi yêu cầu xác thực thành công!");
      setConfirmVisible(false);
      fetchRecruiterStatus();
    } catch (err) {
      message.error("Gửi thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const normFile = (e) => (Array.isArray(e) ? e : e?.fileList || []);

  /* ===========================
     RENDER STATUS
  ============================ */
  if (fetching) {
    return (
      <div className="flex justify-center mt-20">
        <Spin size="large" />
      </div>
    );
  }

  if (recruiter?.verificationStatus === "verified") {
    return (
      <Result
        status="success"
        title="Tài khoản đã được xác thực"
        subTitle="Nhà tuyển dụng đã được cấp dấu tick xanh"
        icon={<CheckCircleTwoTone twoToneColor="#52c41a" />}
      />
    );
  }

  if (recruiter?.verificationStatus === "pending") {
    return (
      <Result
        status="info"
        title="Đang chờ xét duyệt"
        subTitle="Yêu cầu xác thực của bạn đang được admin xử lý"
        icon={<ClockCircleTwoTone twoToneColor="#faad14" />}
      />
    );
  }

  if (recruiter?.verificationStatus === "rejected") {
    return (
      <Result
        status="error"
        title="Xác thực bị từ chối"
        subTitle={recruiter.rejectionNote || "Vui lòng kiểm tra lại hồ sơ"}
        icon={<CloseCircleTwoTone twoToneColor="#ff4d4f" />}
        extra={
          <Button type="primary" onClick={() => setRecruiter(null)}>
            Gửi lại yêu cầu
          </Button>
        }
      />
    );
  }

  /* ===========================
     FORM (unverified)
  ============================ */
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="shadow-xl rounded-xl">
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <h2 className="text-xl font-semibold mb-4">
            🏢 Thông tin doanh nghiệp
          </h2>

          <Form.Item
            name="companyName"
            label="Tên công ty"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="taxCode"
            label="Mã số thuế"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="website" label="Website">
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <h2 className="text-xl font-semibold mt-6 mb-4">
            📄 Tài liệu xác thực
          </h2>

          <Form.Item
            label="Giấy phép kinh doanh"
            name="businessLicense"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true }]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="CCCD mặt trước"
            name="idCardFront"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true }]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="CCCD mặt sau"
            name="idCardBack"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[{ required: true }]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

          <Button
            type="primary"
            onClick={() => setConfirmVisible(true)}
            loading={loading}
          >
            Gửi yêu cầu xác thực
          </Button>
        </Form>
      </Card>

      <Modal
        open={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
        title="Xác nhận gửi yêu cầu"
      >
        Bạn chắc chắn muốn gửi yêu cầu xác thực?
      </Modal>
    </div>
  );
}
