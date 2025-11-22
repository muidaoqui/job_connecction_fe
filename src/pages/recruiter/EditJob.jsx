import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function EditJob() {
  const { id } = useParams(); // lấy job id từ URL
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    location: "",
    salary: "",
    description: "",
    jobType: "",
  });

  const [loading, setLoading] = useState(true);

  // Lấy thông tin job theo ID
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/jobs/${id}`)
      .then((res) => {
        setJob(res.data.job); 
        setLoading(false);
      })
      .catch(() => alert("Không tải được thông tin công việc"));
  }, [id]);

  // Hàm cập nhật job
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8080/api/jobs/${id}`, job);
      alert("Cập nhật thành công!");
      navigate("/recruiter/manage-jobs"); // quay về trang quản lý job
    } catch (error) {
      alert("Cập nhật thất bại!");
    }
  };

  if (loading) return <p className="text-center mt-10">Đang tải...</p>;

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        Chỉnh sửa tin tuyển dụng
      </h1>

      <form onSubmit={handleUpdate} className="space-y-4 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="block font-semibold mb-1">Tiêu đề</label>
          <input
            type="text"
            value={job.title}
            onChange={(e) => setJob({ ...job, title: e.target.value })}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Địa điểm</label>
          <input
            type="text"
            value={job.location}
            onChange={(e) => setJob({ ...job, location: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Lương</label>
          <input
            type="text"
            value={job.salary}
            onChange={(e) => setJob({ ...job, salary: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Mô tả công việc</label>
          <textarea
            rows="4"
            value={job.description}
            onChange={(e) => setJob({ ...job, description: e.target.value })}
            className="w-full p-3 border rounded-lg"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
}
