import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import logo from "../assets/logo.png";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const BASE_URL = "http://localhost:8080";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => {
    const input = document.getElementById("password");
    input.type = input.type === "password" ? "text" : "password";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      const { user, message } = res.data;

      // Nếu user undefined, hiện thông báo và return
      if (!user) {
        toast.error(message || "Đăng nhập thất bại");
        setError(message || "Đăng nhập thất bại");
        setLoading(false);
        return;
      }

      // Kiểm tra email đã được xác thực chưa
      if (!user.emailVerified) {
        // Gửi lại mã OTP
        await axios.post(`${BASE_URL}/api/auth/send-otp`, { email });

        toast.warning(
          "Email chưa được xác thực. Vui lòng kiểm tra email để lấy mã OTP!"
        );
        navigate("/register", {
          state: {
            email,
            needVerification: true,
          },
        });
        setLoading(false);
        return;
      }

      // Lưu thông tin user vào localStorage
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Đăng nhập thành công!");

      // Điều hướng dựa vào role
      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "recruiter":
          navigate("/recruiter/dashboard");
          break;
        default:
          navigate("/"); // Trang chủ cho candidate
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.response?.data?.message || "Đăng nhập thất bại");
      setError(err.response?.data?.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-30 w-full flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-2xl overflow-hidden rounded-xl shadow-lg bg-white">
        {/* Left banner */}
        <div className="bg-gradient-to-br from-purple-200 to-cyan-200 flex flex-col justify-center items-center p-6 md:p-10 text-cyan-700 md:rounded-l-xl">
          <img src={logo} alt="Logo" className="w-auto h-40 rounded-xl mb-4" />
          <p className="text-center mt-10">
            Giải pháp tìm việc nhanh chóng và hiệu quả cho bạn!
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col justify-center w-full p-6 md:p-10">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <h1 className="text-3xl font-bold text-center text-cyan-400">
              Đăng Nhập
            </h1>

            <div>
              <label className="block mb-1">Email</label>
              <input
                type="email"
                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1">Mật khẩu</label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={togglePassword}
                >
                  <FaRegEye />
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="bg-cyan-400 hover:bg-cyan-500 text-white h-10 rounded-lg font-semibold disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
            </button>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <p className="text-center text-sm">
              Chưa có tài khoản?{" "}
              <Link to="/register" className="text-cyan-600 hover:underline">
                Đăng ký
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
