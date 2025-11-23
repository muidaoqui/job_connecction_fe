import { useState } from "react";
import axios from "axios";
import JobCard from "./JobCard";

export default function JobSearch() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [jobs, setJobs] = useState([]);

  const handleSearch = () => {
    axios
      .get("http://localhost:8080/api/jobs", {
        params: { keyword, location, jobType },
      })
      .then((res) => setJobs(res.data))
      .catch((err) => console.log(err));
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800"> Tìm kiếm việc làm</h2>

      <div className="flex gap-3 mb-5">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
          onClick={() => {
            setLocation("HCM");
            handleSearch();
          }}
        >
          Việc làm TPHCM
        </button>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={() => {
            setLocation("HN");
            handleSearch();
          }}
        >
          Việc làm Hà Nội
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        <input
          type="text"
          placeholder="Từ khóa (React, NodeJS...)"
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
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
        >
          <option value="">Loại hình</option>
          <option value="fulltime">Full Time</option>
          <option value="parttime">Part Time</option>
        </select>

        <button
          onClick={handleSearch}
          className="bg-green-600 text-white px-4 py-3 rounded-lg shadow"
        >
          Tìm kiếm
        </button>
      </div>

      {/* JOB LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>

      {jobs.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          Không tìm thấy công việc phù hợp 
        </p>
      )}
    </div>
  );
}
