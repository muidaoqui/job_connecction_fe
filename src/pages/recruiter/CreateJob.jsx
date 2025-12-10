import { useState, memo, useMemo } from "react";
import axios from "axios";

// ===================== STEP INDICATOR (FIXED) =====================
const StepIndicator = memo(({ step }) => {
  return (
    <div className="flex items-center justify-center gap-8 mb-10">
      {[
        { id: 1, label: "Thông tin cơ bản" },
        { id: 2, label: "Chi tiết công việc" },
        { id: 3, label: "Xác nhận" },
      ].map((item) => (
        <div key={item.id} className="flex flex-col items-center">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold transition 
              ${
                step === item.id
                  ? "bg-blue-600 scale-110"
                  : step > item.id
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
          >
            {step > item.id ? "✓" : item.id}
          </div>
          <p
            className={`mt-2 text-sm font-medium ${
              step === item.id ? "text-blue-600" : "text-gray-600"
            }`}
          >
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
});

export default function CreateJob() {
  const [step, setStep] = useState(1);

  // Separate state fixes input lag
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const [requirements, setRequirements] = useState("");
  const [salary, setSalary] = useState("");
  const [type, setType] = useState("");

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const submitJob = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Bạn chưa đăng nhập!");
    return;
  }

  const form = {
    title,
    description,
    location,
    requirements,
    salary,
    type,
  };

  try {
    const res = await axios.post(
      "http://localhost:8080/api/jobs",
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    alert("Đăng tin thành công!");
    console.log(res.data);

  } catch (err) {
    console.error(err);
    alert(
      err.response?.data?.message ||
        "Lỗi đăng tin! Có thể bạn chưa tạo hồ sơ nhà tuyển dụng hoặc hồ sơ công ty."
    );
  }
};
  // ===================== USEMEMO FOR STEP COMPONENTS =====================
  const Step1 = useMemo(
    () => (
      <div className="bg-white p-8 rounded-2xl shadow-lg border">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          1. Thông tin cơ bản
        </h2>

        <div className="space-y-5">
          <div>
            <label className="font-medium text-gray-700">Tiêu đề</label>
            <input
              type="text"
              placeholder="VD: Backend Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="font-medium text-gray-700">Mô tả ngắn</label>
            <textarea
              placeholder="Mô tả chi tiết công việc…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg h-28"
            />
          </div>

          <div>
            <label className="font-medium text-gray-700">Địa điểm</label>
            <input
              placeholder="VD: Hà Nội, Hồ Chí Minh"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={nextStep}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Tiếp tục →
          </button>
        </div>
      </div>
    ),
    [title, description, location]
  );

  const Step2 = useMemo(
    () => (
      <div className="bg-white p-8 rounded-2xl shadow-lg border">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          2. Chi tiết công việc
        </h2>

        <div className="space-y-5">
          <div>
            <label className="font-medium text-gray-700">Yêu cầu</label>
            <textarea
              placeholder="Kinh nghiệm, kỹ năng…"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg h-28"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="font-medium text-gray-700">Lương</label>
              <input
                placeholder="VD: 15 - 25 triệu"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full mt-1 p-3 border rounded-lg"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">Hình thức</label>
              <input
                placeholder="Remote / Fulltime / Parttime"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full mt-1 p-3 border rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={prevStep}
            className="px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300"
          >
            ← Quay lại
          </button>

          <button
            onClick={nextStep}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Tiếp tục →
          </button>
        </div>
      </div>
    ),
    [requirements, salary, type]
  );

  const Step3 = useMemo(
    () => (
      <div className="bg-white p-8 rounded-2xl shadow-lg border">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          3. Xác nhận thông tin
        </h2>

        <div className="space-y-4 text-gray-700">
          <p>
            <strong>Tiêu đề:</strong> {title}
          </p>
          <p>
            <strong>Mô tả:</strong> {description}
          </p>
          <p>
            <strong>Yêu cầu:</strong> {requirements}
          </p>
          <p>
            <strong>Lương:</strong> {salary}
          </p>
          <p>
            <strong>Địa điểm:</strong> {location}
          </p>
          <p>
            <strong>Hình thức:</strong> {type}
          </p>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={prevStep}
            className="px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300"
          >
            ← Quay lại
          </button>

          <button
            onClick={submitJob}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
          >
            Đăng tin
          </button>
        </div>
      </div>
    ),
    [title, description, requirements, salary, location, type]
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <StepIndicator step={step} />

        {step === 1 && Step1}
        {step === 2 && Step2}
        {step === 3 && Step3}
      </div>
    </div>
  );
}
