import React from "react";
import { Layout, Menu, Avatar, Badge, Tooltip, Divider } from "antd";
// import {
//   HomeOutlined,
//   UserOutlined,
//   BriefcaseOutlined,
//   CheckCircleOutlined,
//   TeamOutlined,
//   FileTextOutlined,
//   SettingOutlined,
//   NotificationOutlined,
//   DashboardOutlined,
// } from "@ant-design/icons";
import { SolutionOutlined, NotificationOutlined } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Sider } = Layout;

export default function Sidebar({ collapsed }) {
  const location = useLocation();

  // Xác định key hiện tại dựa trên pathname
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith("/admin/dashboard")) return "dashboard";
    if (path.startsWith("/admin/users")) return "users";
    if (path.startsWith("/admin/jobs")) return "jobs";
    if (path.startsWith("/admin/recruiters-verification")) return "recruiters";
    if (path.startsWith("/admin/companies")) return "companies";
    if (path.startsWith("/admin/reports")) return "reports";
    if (path.startsWith("/admin/settings")) return "settings";
    return "dashboard";
  };

  const menuItems = [
    {
      key: "dashboard",
      icon: <SolutionOutlined />,
      label: collapsed ? null : "Tổng quan",
      title: "Tổng quan",
      children: null,
      link: "/admin/dashboard",
    },
    {
      type: "divider",
      label: collapsed ? null : "QUẢN LÝ NỘI DUNG",
    },
    {
      key: "jobs",
      icon: <SolutionOutlined />,
      label: (
        <div className="flex items-center justify-between w-full">
          <span>{collapsed ? null : "Tin tuyển dụng"}</span>
          <Badge count={12} size="small" className="ml-2" />
        </div>
      ),
      title: "Tin tuyển dụng (12 chờ duyệt)",
      link: "/admin/jobs",
    },
    {
      key: "recruiters",
      icon: <SolutionOutlined />,
      label: (
        <div className="flex items-center justify-between w-full">
          <span>{collapsed ? null : "Xác minh NTD"}</span>
          <Badge count={5} size="small" className="ml-2" />
        </div>
      ),
      title: "Xác minh nhà tuyển dụng (5 chờ)",
      link: "/admin/recruiters-verification",
    },
    {
      key: "companies",
      icon: <SolutionOutlined />,
      label: collapsed ? null : "Công ty",
      title: "Quản lý công ty",
      link: "/admin/companies",
    },
    {
      type: "divider",
      label: collapsed ? null : "NGƯỜI DÙNG & HỆ THỐNG",
    },
    {
      key: "users",
      icon: <SolutionOutlined />,
      label: collapsed ? null : "Người dùng",
      title: "Quản lý người dùng",
      link: "/admin/users",
    },
    {
      key: "reports",
      icon: <SolutionOutlined />,
      label: collapsed ? null : "Báo cáo & Vi phạm",
      title: "Báo cáo và xử lý vi phạm",
      link: "/admin/reports",
    },
    {
      key: "settings",
      icon: <SolutionOutlined />,
      label: collapsed ? null : "Cài đặt hệ thống",
      title: "Cài đặt hệ thống",
      link: "/admin/settings",
    },
  ];

  const renderMenuItem = (item) => {
    if (item.type === "divider") {
      return collapsed ? null : (
        <Divider className="my-2" children={item.label} />
      );
    }

    const menuLabel = collapsed ? (
      <Tooltip title={item.title} placement="right">
        {item.icon}
      </Tooltip>
    ) : (
      <div className="flex items-center">
        {item.icon}
        <span className="ml-3">{item.label}</span>
      </div>
    );

    return {
      key: item.key,
      icon: null, // icon đã được đưa vào label để có tooltip khi collapsed
      label: <Link to={item.link}>{menuLabel}</Link>,
    };
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={260}
      collapsedWidth={80}
      className="h-screen fixed left-0 top-0 z-50 bg-white shadow-xl overflow-hidden"
      style={{ borderRight: "1px solid #f0f0f0", background: "#ffffff" }}
    >
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200 px-4">
        {collapsed ? (
          <Avatar
            size={40}
            className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold"
          >
            A
          </Avatar>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar
              size={44}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold flex items-center justify-center"
            >
              JD
            </Avatar>
            <div>
              <div className="text-lg font-bold text-gray-900">
                JobDashboard
              </div>
              <div className="text-xs text-gray-500 -mt-1">Admin Panel</div>
            </div>
          </div>
        )}
      </div>

      {/* Menu */}
      <div className="h-full overflow-y-auto py-4 px-2">
        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          className="border-r-0"
          style={{ background: "transparent" }}
          items={menuItems.map(renderMenuItem).filter(Boolean)}
        />
      </div>

      {/* Footer Notification (optional) */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 text-sm">
            <NotificationOutlined className="text-blue-600" />
            <div>
              <div className="font-medium">Cập nhật mới</div>
              <div className="text-xs text-gray-500">Phiên bản 2.4.1</div>
            </div>
          </div>
        </div>
      )}
    </Sider>
  );
}
