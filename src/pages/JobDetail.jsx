import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobById } from "../services/jobService";
import { MapPinIcon, CurrencyDollarIcon, BriefcaseIcon } from "@heroicons/react/24/outline";

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    getJobById(id)
      .then((res) => setJob(res.data.job))
      .catch((err) => console.log(err));
  }, [id]);

  if (!job)
    return <p className="text-center mt-10 text-gray-500">Đang tải...</p>;

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-8 lg:px-20">

      {/* CARD */}
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-5xl mx-auto">
        
        {/* TITLE */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {job.title}
        </h1>

        {/* INFO GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">

          <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl">
            <CurrencyDollarIcon className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Mức lương</p>
              <p className="font-semibold text-blue-700">{job.salary || "Thoả thuận"}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl">
            <MapPinIcon className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Địa điểm</p>
              <p className="font-semibold text-green-700">{job.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-xl">
            <BriefcaseIcon className="w-6 h-6 text-purple-600" />
            <div>
              <p className="text-sm text-gray-500">Loại hình</p>
              <p className="font-semibold text-purple-700">{job.jobType}</p>
            </div>
          </div>

        </div>

        {/* DESCRIPTION */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Mô tả công việc</h2>
          <p className="text-gray-700 leading-relaxed">
            {job.description || "Không có mô tả chi tiết."}
          </p>
        </section>

        {/* REQUIREMENTS */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Yêu cầu</h2>
          <p className="text-gray-700 leading-relaxed">
            {job.requirements || "Không có yêu cầu cụ thể."}
          </p>
        </section>

        {/* SKILLS */}
        {job.skills && (
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3">Kỹ năng cần có</h2>
            <div className="flex flex-wrap gap-3">
              {job.skills.map((s, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* APPLY BUTTON */}
        <div className="flex justify-center mt-8">
          <button className="px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold shadow hover:bg-blue-700 transition">
            Ứng tuyển ngay
          </button>
        </div>

      </div>
    </div>
  );
};

export default JobDetail;
