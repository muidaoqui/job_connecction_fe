import React from "react";
import Navbar from "./Navbar";
import { Outlet, useLocation } from "react-router-dom";

function Profile() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

export default Profile;