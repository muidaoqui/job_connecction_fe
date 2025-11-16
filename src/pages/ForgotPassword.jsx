import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/api/auth/forgot-password", { email });
      setMessage("📧 Email đặt lại mật khẩu đã được gửi!");
    } catch (err) {
      setMessage("❌ Không tìm thấy email!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg w-96 border">
        <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
          Quên mật khẩu
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="font-semibold">Email</label>
          <input
            type="email"
            className="w-full p-3 mt-2 mb-4 border rounded-lg"
            placeholder="Nhập email của bạn..."
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700"
          >
            Gửi yêu cầu
          </button>
        </form>

        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </div>
    </div>
  );
}
