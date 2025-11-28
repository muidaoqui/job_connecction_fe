import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  const [showApply, setShowApply] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/jobs/${id}`)
      .then((res) => setJob(res.data.job))
      .catch(() => console.log("Không tải được job"));
  }, [id]);

  const handleApply = async () => {
    if (!form.name || !form.email || !cvFile) {
      return alert("Hãy nhập đầy đủ thông tin và upload CV (PDF)");
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("message", form.message);
    formData.append("cvFile", cvFile);

    try {
      await axios.post(`http://localhost:8080/api/jobs/${id}/apply`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Ứng tuyển thành công!");
      setShowApply(false);
    } catch (err) {
      alert("Ứng tuyển thất bại!");
    }
  };

  if (!job)
    return <p className="text-center mt-10 text-gray-500">Đang tải...</p>;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-4xl mx-auto">

        {/* TITLE */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{job.title}</h1>

        {/* INFO */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

          <div className="bg-blue-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Mức lương</p>
            <p className="font-semibold text-blue-700">{job.salary || "Thoả thuận"}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Địa điểm</p>
            <p className="font-semibold text-green-700">{job.location}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-xl">
            <p className="text-sm text-gray-500">Loại hình</p>
            <p className="font-semibold text-purple-700">{job.jobType}</p>
          </div>

        </div>

        {/* DESCRIPTION */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-2">Mô tả công việc</h2>
          <p className="text-gray-700 whitespace-pre-line">
            {job.description}
          </p>
        </section>

        {/* REQUIREMENTS */}
        {job.requirements && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-2">Yêu cầu</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {job.requirements}
            </p>
          </section>
        )}

        {/* APPLY BUTTON */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setShowApply(true)}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg shadow hover:bg-blue-700"
          >
            Ứng tuyển ngay
          </button>
        </div>

      </div>

      {/* APPLY POPUP */}
      {showApply && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[450px] shadow-lg">

            <h2 className="text-xl font-bold mb-4">Ứng tuyển công việc</h2>

            <input
              type="text"
              placeholder="Họ tên"
              className="w-full p-3 border rounded mb-3"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded mb-3"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <textarea
              placeholder="Lời nhắn"
              className="w-full p-3 border rounded mb-3"
              rows="3"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            ></textarea>

            <label className="font-semibold mb-1 block">Đính kèm CV (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              className="w-full p-3 border rounded mb-3"
              onChange={(e) => setCvFile(e.target.files[0])}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowApply(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Hủy
              </button>

              <button
                onClick={handleApply}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Gửi hồ sơ
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
