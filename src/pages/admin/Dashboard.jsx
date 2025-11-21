import React from "react";
import { Card, Statistic } from "antd";
import {
  UserOutlined,
  ProfileOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

export default function AdminDashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Users */}
      <Card className="shadow rounded-xl p-4">
        <div className="flex items-center gap-4">
          <div className="bg-blue-500 text-white p-4 rounded-full text-xl">
            <UserOutlined />
          </div>
          <Statistic title="Total Users" value={1250} />
        </div>
      </Card>

      {/* Total Jobs */}
      <Card className="shadow rounded-xl p-4">
        <div className="flex items-center gap-4">
          <div className="bg-green-500 text-white p-4 rounded-full text-xl">
            <ProfileOutlined />
          </div>
          <Statistic title="Posted Jobs" value={340} />
        </div>
      </Card>

      {/* Total Companies */}
      <Card className="shadow rounded-xl p-4">
        <div className="flex items-center gap-4">
          <div className="bg-purple-500 text-white p-4 rounded-full text-xl">
            <BarChartOutlined />
          </div>
          <Statistic title="Companies" value={78} />
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow rounded-xl p-4 md:col-span-2">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <ul className="space-y-3 text-gray-700">
          <li className="border p-3 rounded-lg">
            New user registered: john@example.com
          </li>
          <li className="border p-3 rounded-lg">
            New job posted: Frontend Developer
          </li>
          <li className="border p-3 rounded-lg">Company verified: ABC Tech</li>
        </ul>
      </Card>

      {/* System Status */}
      <Card className="shadow rounded-xl p-4">
        <h2 className="text-xl font-semibold mb-4">System Status</h2>
        <ul className="space-y-2 text-gray-700">
          <li className="flex justify-between">
            <span>Server:</span>{" "}
            <span className="text-green-600 font-medium">Online</span>
          </li>
          <li className="flex justify-between">
            <span>API Response:</span>{" "}
            <span className="text-green-600 font-medium">Stable</span>
          </li>
          <li className="flex justify-between">
            <span>Active Sessions:</span>{" "}
            <span className="font-medium">42</span>
          </li>
        </ul>
      </Card>
    </div>
  );
}
