
import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_URL;

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      await axios.post(`${API}/api/auth/reset-password?token=${token}`, {
        password,
      });
      setMessage("✅ Đặt lại mật khẩu thành công! Bạn có thể đăng nhập với mật khẩu mới.");
      setPassword("");
    } catch {
      setError("❌ Token không hợp lệ hoặc đã hết hạn!");
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
        <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
          Đặt lại mật khẩu
        </h2>
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="font-semibold block mb-1" htmlFor="password">Mật khẩu mới</label>
            <input
              id="password"
              type="password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
              placeholder="Nhập mật khẩu mới..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-60`}
            disabled={loading || !password}
          >
            {loading ? "Đang xử lý..." : "Xác nhận"}
          </button>
        </form>
        {message && <p className="mt-4 text-center text-green-600 text-sm font-medium">{message}</p>}
        {error && <p className="mt-4 text-center text-red-500 text-sm font-medium">{error}</p>}
      </div>
    </div>
  );
}
