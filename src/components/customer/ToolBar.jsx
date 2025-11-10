import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import logo from "../../assets/logo.png";

function ToolBar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white flex flex-col items-center">
      {/* Thanh điều hướng dạng tai thỏ */}
      <div className="relative w-full flex justify-between items-center px-8 py-4 rounded-b-[60px] shadow-sm bg-gradient-to-r from-blue-500 to-blue-700">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg p-2 w-48 h-24 flex justify-center items-center mt-20">
          <img src={logo} alt="Logo" className="h-16 w-auto px-4" />
        </div>

        {/* Thanh tìm kiếm */}
        <div className="flex-grow mx-auto">
          <div className="flex items-center rounded-full bg-white border border-blue-300 overflow-hidden w-1/2">
            <input
              type="text"
              placeholder="Vị trí tuyển dụng, công ty,..."
              className="w-full px-5 py-3 focus:outline-none text-gray-700 placeholder-gray-400"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 transition duration-300">
              <SearchOutlined style={{ fontSize: "20px" }} />
            </button>
          </div>
        </div>

        {/* Menu phải */}
        <div className="hidden lg:flex items-center gap-8 text-white font-semibold">
          <Link to="/contact" className="hover:text-yellow-300 transition">
            0123456789
          </Link>

          {/* Hiển thị nút đăng nhập hoặc đăng xuất */}
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

          <span className="cursor-pointer hover:text-yellow-300 transition">
            VI | EN
          </span>
        </div>
      </div>
    </div>
  );
}

export default ToolBar;
