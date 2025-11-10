import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import logo from "../assets/logo.png";
import axios from "axios";
import { toast } from "react-toastify";

function Register() {
  const BASE_URL = "http://localhost:8080";
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const [message, setMessage] = useState("");
  const [msgColor, setMsgColor] = useState("cyan");
  const [showPass, setShowPass] = useState(false);
  const [showConfPass, setShowConfPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Kiểm tra nếu user được chuyển từ trang login sang do chưa xác thực email
  useEffect(() => {
    if (location.state?.needVerification) {
      setEmail(location.state.email);
      setShowOtpForm(true);
      setMessage("Vui lòng nhập mã OTP đã được gửi đến email của bạn");
      setMsgColor("blue");
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (pass !== confPass) {
      setMessage("❌ Mật khẩu nhập lại không khớp!");
      setMsgColor("red");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/api/auth/register`, {
        name: fullname,
        email,
        password: pass,
      });

      // Gửi mã OTP
      await axios.post(`${BASE_URL}/api/auth/email/send-otp`, { email });
      
      setShowOtpForm(true);
      setMessage("✅ Vui lòng kiểm tra email và nhập mã OTP để xác thực tài khoản!");
      setMsgColor("green");
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Đăng ký thất bại!");
      setMsgColor("red");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/api/auth/email/verify-otp`, {
        email,
        otp,
      });

      toast.success("Xác thực email thành công!");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Xác thực OTP thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-30 w-full flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="flex flex-col md:flex-row w-full max-w-2xl overflow-hidden rounded-xl shadow-lg bg-white">
        {/* Form */}
        <div className="flex flex-col justify-center w-full p-6 md:p-10">
          {!showOtpForm ? (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <h2 className="text-3xl font-bold text-center text-cyan-400">
                Đăng ký
              </h2>

            <div>
              <label className="block mb-1">Họ và tên</label>
              <input
                type="text"
                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Nhập họ và tên"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </div>

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
                  type={showPass ? "text" : "password"}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Nhập mật khẩu"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  required
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPass(!showPass)}
                >
                  <FaRegEye />
                </span>
              </div>
            </div>

            <div>
              <label className="block mb-1">Nhập lại mật khẩu</label>
              <div className="relative">
                <input
                  type={showConfPass ? "text" : "password"}
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  placeholder="Nhập lại mật khẩu"
                  value={confPass}
                  onChange={(e) => setConfPass(e.target.value)}
                  required
                />
                <span
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowConfPass(!showConfPass)}
                >
                  <FaRegEye />
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-400 hover:bg-cyan-500 text-white h-10 rounded-lg font-semibold"
            >
              {loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>

            {message && (
              <p className={`text-sm text-${msgColor}-600 text-center`}>
                {message}
              </p>
            )}

            <p className="text-center text-sm">
              Bạn đã có tài khoản?{" "}
              <Link to="/login" className="text-cyan-400 hover:underline">
                Đăng nhập
              </Link>
            </p>
          </form>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleVerifyOtp}>
            <h2 className="text-3xl font-bold text-center text-cyan-400">
              Xác thực OTP
            </h2>

            <div>
              <label className="block mb-1">Nhập mã OTP</label>
              <input
                type="text"
                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Nhập mã OTP từ email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-400 hover:bg-cyan-500 text-white h-10 rounded-lg font-semibold"
            >
              {loading ? "Đang xác thực..." : "Xác thực OTP"}
            </button>

            {message && (
              <p className={`text-sm text-${msgColor}-600 text-center`}>
                {message}
              </p>
            )}
          </form>
        )}
        </div>

        {/* Banner */}
        <div className="bg-gradient-to-br from-purple-200 to-cyan-200 flex flex-col justify-center items-center p-6 md:p-10 text-cyan-700 md:rounded-r-xl">
          <img src={logo} alt="Logo" className="w-auto h-40 rounded-xl mb-4" />
          <p className="text-center mt-10">
            Giải pháp tìm việc nhanh chóng và hiệu quả cho bạn!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
