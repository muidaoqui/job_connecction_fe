import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ApplyJob() {
  const { id } = useParams(); // lấy jobId từ URL

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [cvFile, setCvFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cvFile) {
      alert("Vui lòng chọn file CV (PDF)");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("message", message);
    formData.append("cvFile", cvFile);

    try {
      await axios.post(`http://localhost:8080/api/jobs/${id}/apply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Ứng tuyển thành công!");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi nộp đơn!");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Ứng tuyển công việc</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block mb-1 font-semibold">Tên</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Lời nhắn</label>
          <textarea
            className="w-full p-2 border rounded"
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Tải lên CV (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setCvFile(e.target.files[0])}
            required
          />
        </div>

        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Gửi đơn ứng tuyển
        </button>
      </form>
    </div>
  );
}
