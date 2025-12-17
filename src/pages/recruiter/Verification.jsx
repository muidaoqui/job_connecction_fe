import React, { useState } from "react";
import axios from "axios";
import { Card, Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined, CheckCircleTwoTone } from "@ant-design/icons";

export default function RecruiterVerification() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    const fd = new FormData();
    Object.keys(values).forEach((key) => {
      if (
        key === "businessLicense" ||
        key === "idCardFront" ||
        key === "idCardBack"
      ) {
        if (values[key] && values[key].file) {
          fd.append(key, values[key].file.originFileObj);
        }
      } else {
        fd.append(key, values[key]);
      }
    });

    try {
      setLoading(true);
      await axios.post(
        `http://localhost:8080/api/recruiter/verify/${user._id}`,
        fd
      );
      message.success("Gửi yêu cầu xác thực thành công!");
      form.resetFields();
    } catch (err) {
      message.error("Gửi thất bại, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Xác thực nhà tuyển dụng
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Vui lòng cung cấp thông tin và giấy tờ để hệ thống xác thực. Sau khi
          được duyệt, tài khoản sẽ có dấu tick xanh{" "}
          <CheckCircleTwoTone twoToneColor="#52c41a" /> tăng uy tín.
        </p>
      </div>

      <Card className="shadow-xl rounded-2xl p-6">
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          {/* Company Information */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            🏢 Thông tin doanh nghiệp
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label="Tên công ty"
              name="companyName"
              rules={[{ required: true, message: "Vui lòng nhập tên công ty" }]}
            >
              <Input className="py-3" placeholder="VD: Công ty TNHH ABC" />
            </Form.Item>

            <Form.Item
              label="Mã số thuế"
              name="taxCode"
              rules={[{ required: true, message: "Vui lòng nhập mã số thuế" }]}
            >
              <Input className="py-3" placeholder="VD: 0123456789" />
            </Form.Item>

            <Form.Item
              label="Số điện thoại liên hệ"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
              ]}
            >
              <Input className="py-3" placeholder="VD: 0901234567" />
            </Form.Item>

            <Form.Item label="Website (tuỳ chọn)" name="website">
              <Input className="py-3" placeholder="VD: https://abc.com" />
            </Form.Item>

            <Form.Item
              label="Địa chỉ công ty"
              name="address"
              className="md:col-span-2"
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ công ty" },
              ]}
            >
              <Input
                className="py-3"
                placeholder="VD: 123 Nguyễn Văn Cừ, Q.5, HCM"
              />
            </Form.Item>
          </div>

          <hr className="my-8" />

          {/* Upload Section */}
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            📄 Tài liệu xác thực
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label="Giấy phép kinh doanh"
              name="businessLicense"
              valuePropName="file"
              rules={[
                {
                  required: true,
                  message: "Vui lòng upload giấy phép kinh doanh",
                },
              ]}
            >
              <Upload
                maxCount={1}
                beforeUpload={() => false}
                className="w-full"
              >
                <Button icon={<UploadOutlined />}>Upload file</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              label="CCCD mặt trước"
              name="idCardFront"
              valuePropName="file"
              rules={[
                { required: true, message: "Vui lòng upload CCCD mặt trước" },
              ]}
            >
              <Upload maxCount={1} beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Upload file</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              label="CCCD mặt sau"
              name="idCardBack"
              valuePropName="file"
              rules={[
                { required: true, message: "Vui lòng upload CCCD mặt sau" },
              ]}
            >
              <Upload maxCount={1} beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Upload file</Button>
              </Upload>
            </Form.Item>
          </div>

          <div className="mt-8">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full md:w-auto px-10 py-5 text-base rounded-lg"
            >
              Gửi yêu cầu xác thực
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}
