import { useState, memo, useMemo } from "react";
import axios from "axios";

/* ===================== STEP INDICATOR ===================== */
const StepIndicator = memo(({ step }) => {
  const steps = [
    { id: 1, label: "Thông tin cơ bản" },
    { id: 2, label: "Chi tiết công việc" },
    { id: 3, label: "Xác nhận" },
  ];

  return (
    <div className="flex items-center justify-center gap-8 mb-10">
      {steps.map((item) => (
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

/* ===================== CREATE JOB ===================== */
export default function CreateJob() {
  const [step, setStep] = useState(1);

  // Step 1
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  // Step 2
  const [requirements, setRequirements] = useState("");
  const [salary, setSalary] = useState("");
  const [jobType, setJobType] = useState("");

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  /* ===================== SUBMIT JOB ===================== */
  const submitJob = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Bạn chưa đăng nhập!");
        return;
      }

      const jobData = {
        title,
        description,
        requirements,
        salary,
        location,
        jobType, // 🔥 ĐÚNG tên field backend
      };

      await axios.post(
        "http://localhost:8080/api/jobs",
        jobData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("🎉 Đăng tin thành công!");
    } catch (error) {
      console.error("❌ Lỗi tạo job:", error?.response?.data || error);
      alert(
        error?.response?.data?.message ||
          "Không thể đăng tin, vui lòng kiểm tra lại!"
      );
    }
  };

  /* ===================== STEP 1 ===================== */
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg"
              placeholder="VD: Backend Developer"
            />
          </div>

          <div>
            <label className="font-medium text-gray-700">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg h-28"
              placeholder="Mô tả chi tiết công việc…"
            />
          </div>

          <div>
            <label className="font-medium text-gray-700">Địa điểm</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg"
              placeholder="VD: Hà Nội, Hồ Chí Minh"
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

  /* ===================== STEP 2 ===================== */
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
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full mt-1 p-3 border rounded-lg h-28"
              placeholder="Kỹ năng, kinh nghiệm…"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="font-medium text-gray-700">Lương</label>
              <input
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full mt-1 p-3 border rounded-lg"
                placeholder="VD: 15 - 25 triệu"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">Hình thức</label>
              <input
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full mt-1 p-3 border rounded-lg"
                placeholder="Full-time / Part-time / Remote"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={prevStep}
            className="px-6 py-3 bg-gray-200 rounded-xl"
          >
            ← Quay lại
          </button>

          <button
            onClick={nextStep}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl"
          >
            Tiếp tục →
          </button>
        </div>
      </div>
    ),
    [requirements, salary, jobType]
  );

  /* ===================== STEP 3 ===================== */
  const Step3 = useMemo(
    () => (
      <div className="bg-white p-8 rounded-2xl shadow-lg border">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          3. Xác nhận thông tin
        </h2>

        <div className="space-y-3 text-gray-700">
          <p><b>Tiêu đề:</b> {title}</p>
          <p><b>Mô tả:</b> {description}</p>
          <p><b>Yêu cầu:</b> {requirements}</p>
          <p><b>Lương:</b> {salary}</p>
          <p><b>Địa điểm:</b> {location}</p>
          <p><b>Hình thức:</b> {jobType}</p>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={prevStep}
            className="px-6 py-3 bg-gray-200 rounded-xl"
          >
            ← Quay lại
          </button>

          <button
            onClick={submitJob}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl"
          >
            Đăng tin
          </button>
        </div>
      </div>
    ),
    [title, description, requirements, salary, location, jobType]
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
