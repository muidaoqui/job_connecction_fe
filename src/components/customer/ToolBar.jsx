import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import logo from "../../assets/logo.png";
import SearchInput from "../../components/SearchInput";

function ToolBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/customer/job-search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };
  const requireLogin = (callback) => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
  } else {
    callback();
  }
};

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white flex flex-col items-center">
      {/* Thanh điều hướng dạng tai thỏ */}
      <div className="relative w-full flex justify-between items-center px-8 py-4 rounded-b-[60px] shadow-sm bg-gradient-to-r from-blue-500 to-blue-700 h-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg p-2 w-48 h-24 flex justify-center items-center mt-18">
          <img onClick={() => navigate("/")} src={logo} alt="Logo" className="h-16 w-auto px-4" />
        </div>

          {/* Thanh tìm kiếm */}
          <div className="flex justify-center items-center gap-4">

          {/* Thanh tìm kiếm */}
          <div className="flex items-center rounded-full bg-white border border-blue-300 overflow-hidden w-[500px] shadow-md">
            <input
              type="text"
              placeholder="Vị trí tuyển dụng, công ty,..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="w-full px-5 py-3 focus:outline-none text-gray-700 placeholder-gray-400"
            />
            <button 
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 transition duration-300"
            >
              <SearchOutlined style={{ fontSize: '20px' }} />
            </button>
          </div>
        </div>

        {/* Menu phải */}
<div className="hidden lg:flex items-center gap-6 text-white font-semibold ml-auto pr-6">

  {/* Dropdown Nhà tuyển dụng */}
  <div className="relative group">
    <button className="cursor-pointer hover:text-yellow-300 transition font-semibold">
      Employers ▼
    </button>

    {/* Dropdown */}
    <div
      className="absolute left-0 top-full bg-white text-gray-700 shadow-xl rounded-lg w-56 p-2
      opacity-0 invisible 
      group-hover:opacity-100 group-hover:visible
      transition-all duration-200 ease-out z-[9999]"
    >
      <button
        onClick={() => requireLogin(() => navigate('/recruiter/create-job'))}
        className='block w-full text-left px-4 py-2 hover:bg-blue-100 rounded-md'
      >
        Đăng tin tuyển dụng
      </button>

      <button
        onClick={() => requireLogin(() => navigate('/recruiter/manage-jobs'))}
        className='block w-full text-left px-4 py-2 hover:bg-blue-100 rounded-md'
      >
        Quản lý tin tuyển dụng
      </button>

      <button
        onClick={() => requireLogin(() => navigate('/recruiter/applicants'))}
        className='block w-full text-left px-4 py-2 hover:bg-blue-100 rounded-md'
      >
        Danh sách ứng viên
      </button>

      <button
        onClick={() => requireLogin(() => navigate('/recruiter/dashboard'))}
        className='block w-full text-left px-4 py-2 hover:bg-blue-100 rounded-md'
      >
        Trang tổng quan
      </button>
    </div>
  </div>

  {/* Email - Click to go to profile */}
  {user && (
    <button
      onClick={() => navigate("/customer/mysaramin")}
      className="max-w-[180px] truncate hover:text-yellow-300 transition bg-none border-none cursor-pointer text-white font-semibold"
    >
      {user.email}
    </button>
  )}

  {/* Nút đăng nhập / đăng xuất */}
  {user ? (
    <button
      onClick={handleLogout}
      className="hover:text-yellow-300 transition"
    >
      Đăng xuất
    </button>
  ) : (
    <button
      onClick={() => navigate("/login")}
      className="hover:text-yellow-300 transition"
    >
      Đăng nhập
    </button>
  )}

  {/* Ngôn ngữ */}
  <span className="cursor-pointer hover:text-yellow-300 transition">
    VI | EN
  </span>
</div>

      </div>
    </div>
  );
}

export default ToolBar;
