
import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const API = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      await axios.post(`${API}/api/auth/forgot-password`, { email });
      setMessage("📧 Đã gửi email đặt lại mật khẩu! Vui lòng kiểm tra hộp thư.");
      setEmail("");
    } catch (err) {
      setError("❌ Không tìm thấy email hoặc có lỗi xảy ra!");
    } finally {
      setLoading(false);
      setTimeout(() => {
        setMessage("");
        setError("");
      }, 5000);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 md:p-10 rounded-xl shadow-lg w-full max-w-md border">
        <h2 className="text-2xl font-bold mb-6 text-center text-cyan-600">
          Quên mật khẩu
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-semibold block mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-300"
              placeholder="Nhập email bạn đã đăng ký..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold hover:bg-cyan-700 transition disabled:opacity-60`}
            disabled={loading || !email}
          >
            {loading ? "Đang gửi..." : "Gửi yêu cầu"}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-green-600 text-sm font-medium">{message}</p>}
        {error && <p className="mt-4 text-center text-red-500 text-sm font-medium">{error}</p>}
      </div>
    </div>
  );
}
