// AdminConfirmModal.jsx
import React from "react";
import { Modal, Button } from "antd";

export default function AdminConfirmModal({
  open,
  title = "Xác nhận hành động",
  description = "Bạn có chắc chắn muốn thực hiện hành động này?",
  okText = "Xác nhận",
  cancelText = "Hủy",
  okType = "primary",
  loading = false,
  onOk,
  onCancel,
}) {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      className="modern-modal"
      centered
    >
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>

      <div className="flex justify-end gap-2">
        <Button onClick={onCancel}>{cancelText}</Button>
        <Button type={okType} loading={loading} onClick={onOk}>
          {okText}
        </Button>
      </div>
    </Modal>
  );
}
