import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Radio,
  Upload,
  message,
  Card,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  getProfile,
  createProfile,
  updateProfile,
  uploadResume,
} from "../../api/profileAPI";
import dayjs from "dayjs";

const Profile = () => {
  const [form] = Form.useForm();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        const data = res.data;
        setCandidate(data.candidate);

        if (data) {
          form.setFieldsValue({
            name: data.name,
            address: data.candidate?.address,
            gender: data.candidate?.gender,
            dateOfBirth: data.candidate?.dateOfBirth
              ? dayjs(data.candidate.dateOfBirth)
              : null,
            profileSummary: data.candidate?.profileSummary,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [form]);

  // Submit form
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const data = {
        ...values,
        dateOfBirth: values.dateOfBirth
          ? values.dateOfBirth.toISOString()
          : null,
      };

      if (candidate) {
        await updateProfile(data);
        message.success("Profile updated successfully");
      } else {
        await createProfile(data);
        message.success("Profile created successfully");
      }
    } catch (error) {
      message.error("Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  // Upload CV
  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("resume", file);
    try {
      await uploadResume(formData);
      message.success("CV uploaded successfully");
    } catch (error) {
      message.error("CV upload failed");
    }
  };

  return (
    <div className="flex justify-center mt-10">
      <Card title="Candidate Profile" style={{ width: 600 }}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Enter your full name" />
          </Form.Item>

          <Form.Item label="Address" name="address">
            <Input placeholder="Enter your address" />
          </Form.Item>

          <Form.Item label="Gender" name="gender">
            <Radio.Group>
              <Radio value="Male">Male</Radio>
              <Radio value="Female">Female</Radio>
              <Radio value="Other">Other</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="Date of Birth" name="dateOfBirth">
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Profile Summary" name="profileSummary">
            <Input.TextArea rows={3} placeholder="Write something about you" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: "100%" }}
            >
              {candidate ? "Update Profile" : "Create Profile"}
            </Button>
          </Form.Item>
        </Form>

        <Upload customRequest={handleUpload} showUploadList={false}>
          <Button icon={<UploadOutlined />}>Upload CV</Button>
        </Upload>
      </Card>
    </div>
  );
};

export default Profile;
