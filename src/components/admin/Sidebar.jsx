import React from "react";
import { Layout, Menu } from "antd";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
const { Sider } = Layout;

export default function Sidebar({ collapsed }) {
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={220}
      className="bg-white shadow-lg"
    >
      <div className="text-center text-xl font-bold py-4 border-b">Admin</div>

      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        items={[
          {
            key: "1",
            icon: <HomeOutlined />,
            label: <Link to="/admin/dashboard">Dashboard</Link>,
          },
          {
            key: "2",
            icon: <UserOutlined />,
            label: <Link to="/admin/users">Users</Link>,
          },
        ]}
      />
    </Sider>
  );
}
