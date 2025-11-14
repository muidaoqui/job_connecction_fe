import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/api/auth/reset-password/${token}`, {
        password,
      });
      setMessage("✅ Đặt lại mật khẩu thành công!");
    } catch {
      setMessage("❌ Token không hợp lệ hoặc đã hết hạn!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg w-96 border">
        <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
          Đặt lại mật khẩu
        </h2>

        <form onSubmit={handleReset}>
          <label className="font-semibold">Mật khẩu mới</label>
          <input
            type="password"
            className="w-full p-3 mt-2 mb-4 border rounded-lg"
            placeholder="Nhập mật khẩu mới..."
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
          >
            Xác nhận
          </button>
        </form>

        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </div>
    </div>
  );
}
