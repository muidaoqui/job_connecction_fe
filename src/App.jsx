import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import CustomerLayout from "./components/customer/CustomerLayout";
import Home from "./pages/customer/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/customer/profile/Profile";
import MySaramin from "./pages/customer/profile/MySaramin";
import JobMana from "./pages/customer/profile/JobMana";
import CVMana from "./pages/customer/profile/CVMana";
import EmailMana from "./pages/customer/profile/EmailMana";
import PerTest from "./pages/customer/profile/PerTest";
import Navbar from "./pages/customer/profile/Navbar";

import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import JobDetail from "./pages/JobDetail";
import JobSearch from "./pages/JobSearch";

import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import UsersPage from "./pages/admin/User";
function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="customer" element={<Profile />}>
            <Route path="navbar" element={<Navbar />} />
            <Route path="mysaramin" element={<MySaramin />} />
            <Route path="jobmanagement" element={<JobMana />} />
            <Route path="cvmanagement" element={<CVMana />} />
            <Route path="emailmanagement" element={<EmailMana />} />
            <Route path="pertest" element={<PerTest />} />
          </Route>
          <Route path="profile" element={<Profile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/jobs" element={<JobSearch />} />
          <Route path="/job/:id" element={<JobDetail />} />
          <Route path="/recruiter/create-job" element={<CreateJob />} />
          <Route path="/recruiter/manage-jobs" element={<ManageJobs />} />
          <Route path="/recruiter/applicants/:jobId" element={<Applicants />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
