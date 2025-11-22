import React from "react";
import { Layout, Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const { Header } = Layout;

export default function Toolbar({ collapsed, setCollapsed }) {
  return (
    <Header className="bg-white shadow flex items-center justify-between px-4">
      <Button
        type="text"
        onClick={() => setCollapsed(!collapsed)}
        className="text-lg"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      />

      <div className="flex items-center gap-4">
        <span className="font-semibold">Admin Panel</span>
        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className="w-9 h-9 rounded-full border"
        />
      </div>
    </Header>
  );
}
