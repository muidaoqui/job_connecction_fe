import { useState, memo, useMemo } from "react";
import axios from "axios";

/* ===================== CONSTANTS ===================== */
const LOCATIONS = [
  "Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Cần Thơ",
  "Remote",
];

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Remote",
  "Hybrid",
  "Intern",
];

const SALARY_RANGES = [
  "Thỏa thuận",
  "10 - 15 triệu",
  "15 - 25 triệu",
  "25 - 40 triệu",
  "Trên 40 triệu",
];
const EXPERIENCE_LEVELS = [
  "Không yêu cầu",
  "Dưới 1 năm",
  "1 - 2 năm",
  "2 - 3 năm",
  "3 - 5 năm",
  "Trên 5 năm",
];
/* ===================== STEP INDICATOR ===================== */
const StepIndicator = memo(({ step }) => {
  const steps = [
    { id: 1, label: "Thông tin cơ bản" },
    { id: 2, label: "Chi tiết công việc" },
    { id: 3, label: "Xác nhận" },
  ];
  const API = import.meta.env.VITE_API_URL;

  return (
    <div className="flex items-center justify-center gap-8 mb-10">
      {steps.map((item) => (
        <div key={item.id} className="flex flex-col items-center">
          <div
            className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold
              ${
                step === item.id
                  ? "bg-blue-600"
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
  const [experience, setExperience] = useState("");


  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  /* ===================== SUBMIT JOB ===================== */
  const submitJob = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Bạn chưa đăng nhập!");

      await axios.post(
        `${API}/api/jobs`,
        {
          title,
          description,
          requirements,
          salary,
          location,
          jobType,
          experience,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("🎉 Đăng tin thành công!");
    } catch (err) {
      console.error(err);
      alert("❌ Không thể đăng tin");
    }
  };

  /* ===================== STEP 1 ===================== */
  const Step1 = useMemo(
    () => (
      <div className="bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          1. Thông tin cơ bản
        </h2>

        <div className="space-y-5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border rounded-lg"
            placeholder="Tiêu đề công việc"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border rounded-lg h-28"
            placeholder="Mô tả công việc"
          />

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-3 border rounded-lg bg-white"
          >
            <option value="">-- Chọn địa điểm --</option>
            {LOCATIONS.map((loc) => (
              <option key={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={nextStep}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl"
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
      <div className="bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          2. Chi tiết công việc
        </h2>

        <textarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          className="w-full p-3 border rounded-lg h-28 mb-5"
          placeholder="Yêu cầu công việc"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <select
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="p-3 border rounded-lg bg-white"
          >
            <option value="">-- Chọn mức lương --</option>
            {SALARY_RANGES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="p-3 border rounded-lg bg-white"
          >
            <option value="">-- Chọn hình thức --</option>
            {JOB_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
           <select
    value={experience}
    onChange={(e) => setExperience(e.target.value)}
    className="p-3 border rounded-lg bg-white"
  >
    <option value="">-- Chọn kinh nghiệm --</option>
    {EXPERIENCE_LEVELS.map((exp) => (
      <option key={exp}>{exp}</option>
    ))}
  </select>
          
        </div>

        <div className="flex justify-between mt-6">
          <button onClick={prevStep} className="px-6 py-3 bg-gray-200 rounded-xl">
            ← Quay lại
          </button>
          <button onClick={nextStep} className="px-6 py-3 bg-blue-600 text-white rounded-xl">
            Tiếp tục →
          </button>
        </div>
      </div>
    ),
    [requirements, salary, jobType,experience]
  );

  /* ===================== STEP 3 ===================== */
  const Step3 = useMemo(
    () => (
      <div className="bg-white p-8 rounded-2xl shadow">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">
          3. Xác nhận
        </h2>

        <p><b>Tiêu đề:</b> {title}</p>
        <p><b>Địa điểm:</b> {location}</p>
        <p><b>Lương:</b> {salary}</p>
        <p><b>Hình thức:</b> {jobType}</p>
        <p><b>Kinh nghiệm:</b> {experience}</p>


        <div className="flex justify-between mt-6">
          <button onClick={prevStep} className="px-6 py-3 bg-gray-200 rounded-xl">
            ← Quay lại
          </button>
          <button onClick={submitJob} className="px-6 py-3 bg-blue-600 text-white rounded-xl">
            Đăng tin
          </button>
        </div>
      </div>
    ),
    [title, location, salary, jobType]
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto">
        <StepIndicator step={step} />
        {step === 1 && Step1}
        {step === 2 && Step2}
        {step === 3 && Step3}
      </div>
    </div>
  );
}
