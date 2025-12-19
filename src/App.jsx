import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";

/* ================= LAYOUT ================= */
import CustomerLayout from "./components/customer/CustomerLayout";
import AdminLayout from "./components/admin/AdminLayout";

/* ================= CUSTOMER ================= */
import Home from "./pages/customer/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Companies from "./pages/customer/Companies";
import Recruiters from "./pages/customer/Recruiters";
import People from "./pages/customer/People";
import CompanyDetail from "./pages/customer/CompanyDetail";
import CusJobDetail from "./pages/customer/JobDetail";
import CusJobSearch from "./pages/customer/JobSearch";
import ApplyJob from "./pages/customer/ApplyJob";
import Profile from "./pages/customer/profile/Profile";
import MySaramin from "./pages/customer/profile/MySaramin";
import JobMana from "./pages/customer/profile/JobMana";
import CVMana from "./pages/customer/profile/CVMana";
import EmailMana from "./pages/customer/profile/EmailMana";
import PerTest from "./pages/customer/profile/PerTest";
import Navbar from "./pages/customer/profile/Navbar";
import JobSearch from "./pages/JobSearch";
import JobDetail from "./pages/customer/JobDetail";
/* ================= AUTH ================= */
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/* ================= RECRUITER ================= */
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import CreateJob from "./pages/recruiter/CreateJob";
import ManageJobs from "./pages/recruiter/ManageJobs";
import EditJob from "./pages/recruiter/EditJob";
import Applicants from "./pages/recruiter/Applicants";
import JobApplicants from "./pages/recruiter/JobApplicants";
import ReviewApplications from "./pages/recruiter/ReviewApplications";
import CompanyProfile from "./pages/recruiter/CompanyProfile";
import CompanyPublicProfile from "./pages/recruiter/CompanyPublicProfile";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";
import Verification from "./pages/recruiter/Verification";

/* ================= ADMIN ================= */
import AdminDashboard from "./pages/admin/Dashboard";
import UsersPage from "./pages/admin/User";
import AdminPendingJobs from "./pages/admin/Job";
import RecruiterVerification from "./pages/admin/RecruiterVerification";

import "react-toastify/dist/ReactToastify.css";

/* ================= AUTH GUARD ================= */
const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

/* ================= MAIN APP ================= */
function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* ================= CUSTOMER + RECRUITER LAYOUT ================= */}
        <Route path="/" element={<CustomerLayout />}>
        {/* -------- CUSTOMER PROFILE -------- */}
<Route path="customer" element={<Profile />}>
  <Route path="navbar" element={<Navbar />} />
  <Route path="mysaramin" element={<MySaramin />} />
  <Route path="jobmanagement" element={<JobMana />} />
  <Route path="cvmanagement" element={<CVMana />} />
  <Route path="emailmanagement" element={<EmailMana />} />
  <Route path="pertest" element={<PerTest />} />

</Route>
  <Route path="jobs" element={<JobSearch />} />
<Route path="jobs/:id" element={<JobDetail />} />
          {/* -------- CUSTOMER -------- */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />

          <Route path="companies" element={<Companies />} />
          <Route path="recruiters" element={<Recruiters />} />
          <Route path="people" element={<People />} />
          <Route path="company/:companyId" element={<CompanyDetail />} />
          <Route path="job/:id" element={<CusJobDetail />} />
          <Route path="job-search" element={<CusJobSearch />} />
          <Route path="apply-job/:id" element={<ApplyJob />} />

          {/* -------- RECRUITER -------- */}
          <Route
            path="recruiter/dashboard"
            element={
              <RequireAuth>
                <RecruiterDashboard />
              </RequireAuth>
            }
          />

          <Route
            path="recruiter/create-job"
            element={
              <RequireAuth>
                <CreateJob />
              </RequireAuth>
            }
          />

          <Route
            path="recruiter/manage-jobs"
            element={
              <RequireAuth>
                <ManageJobs />
              </RequireAuth>
            }
          />

          <Route
            path="recruiter/edit-job/:id"
            element={
              <RequireAuth>
                <EditJob />
              </RequireAuth>
            }
          />

          {/* Danh sách ứng viên */}
          <Route
            path="recruiter/applicants"
            element={
              <RequireAuth>
                <Applicants />
              </RequireAuth>
            }
          />

          {/* Ứng viên theo từng job (GIỮ CỦA BẠN ANH) */}
          <Route
            path="recruiter/applicants/:jobId"
            element={
              <RequireAuth>
                <JobApplicants />
              </RequireAuth>
            }
          />

          <Route
            path="recruiter/applicants/manage"
            element={
              <RequireAuth>
                <ReviewApplications />
              </RequireAuth>
            }
          />

          <Route
            path="recruiter/company-profile"
            element={
              <RequireAuth>
                <CompanyProfile />
              </RequireAuth>
            }
          />

          <Route
            path="recruiter/company/:companyId"
            element={
              <RequireAuth>
                <CompanyPublicProfile />
              </RequireAuth>
            }
          />

          <Route
            path="recruiter/profile"
            element={
              <RequireAuth>
                <RecruiterProfile />
              </RequireAuth>
            }
          />

          <Route
            path="recruiter/verification"
            element={
              <RequireAuth>
                <Verification />
              </RequireAuth>
            }
          />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="jobs" element={<AdminPendingJobs />} />
          <Route
            path="recruiters-verification"
            element={<RecruiterVerification />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
