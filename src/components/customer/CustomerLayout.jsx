import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Toolbar from "./ToolBar";
import Footer from "./Footer";

export default function CustomerLayout() {
  const location = useLocation();
  const hideLayout =
    location.pathname === "/login" || location.pathname === "/register";

  // Nếu là trang login/register -> ẩn toolbar và footer
  if (hideLayout) {
    return <Outlet />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Toolbar />
      <main className="flex-grow mt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}