import { useState } from "react";
import { searchJobs } from "../services/jobService";
import { MapPinIcon, CurrencyDollarIcon, BriefcaseIcon } from "@heroicons/react/24/outline";

const JobSearch = () => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [jobs, setJobs] = useState([]);

  const handleSearch = (params = {}) => {
    searchJobs({
      keyword,
      location,
      jobType,
      ...params,
    })
      .then((res) => setJobs(res.data))
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        🔍 Tìm kiếm việc làm
      </h2>

      {/* Quick Filter */}
      <div className="flex gap-3 mb-5">
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow"
          onClick={() => {
            setLocation("HCM");
            handleSearch({ location: "HCM" });
          }}
        >
          Việc làm TPHCM
        </button>

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
          onClick={() => {
            setLocation("HN");
            handleSearch({ location: "HN" });
          }}
        >
          Việc làm Hà Nội
        </button>
      </div>

      {/* Search Box */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <input
          type="text"
          placeholder="Từ khóa (React, NodeJS, Tester...)"
          className="border p-3 rounded-lg shadow-sm"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <input
          type="text"
          placeholder="Địa điểm"
          className="border p-3 rounded-lg shadow-sm"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <select
          className="border p-3 rounded-lg shadow-sm"
          onChange={(e) => setJobType(e.target.value)}
        >
          <option value="">Loại hình</option>
          <option value="fulltime">Full Time</option>
          <option value="parttime">Part Time</option>
        </select>

        <button
          onClick={() => handleSearch()}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg shadow"
        >
          Tìm kiếm
        </button>
      </div>

      {/* Job List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div
            key={job._id}
            onClick={() => (window.location.href = `/job/${job._id}`)}
            className="p-5 border rounded-xl shadow hover:shadow-xl cursor-pointer transition-all bg-white hover:-translate-y-1"
          >
            {/* Job Title */}
            <h3 className="text-xl font-bold mb-2 text-gray-900">{job.title}</h3>

            {/* Info Row */}
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <MapPinIcon className="w-5 h-5 text-red-500" />
              <span>{job.location || "Không rõ địa điểm"}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <CurrencyDollarIcon className="w-5 h-5 text-green-500" />
              <span>{job.salary || "Thỏa thuận"}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <BriefcaseIcon className="w-5 h-5 text-blue-500" />
              <span>{job.jobType || "Không rõ"}</span>
            </div>

            {/* Badges */}
            <div className="flex gap-2 mt-3">
              <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                {job.jobType || "Full time"}
              </span>
              <span className="bg-blue-200 text-blue-700 px-3 py-1 rounded-full text-sm">
                {job.location}
              </span>
            </div>
          </div>
        ))}
      </div>

      {jobs.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          Không tìm thấy công việc phù hợp 😢
        </p>
      )}
    </div>
  );
};

export default JobSearch;
