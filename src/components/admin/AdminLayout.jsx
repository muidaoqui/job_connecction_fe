import React, { useState } from "react";
import { Layout } from "antd";
import Toolbar from "./Toolbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout className="h-screen">
      {" "}
      {/* FULL HEIGHT */}
      <Sidebar collapsed={collapsed} />
      <Layout className="h-full">
        <Toolbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <Content className="p-6 bg-gray-50 h-full">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
