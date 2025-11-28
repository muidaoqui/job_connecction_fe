import { useState, useEffect } from "react";
import axios from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";
import JobSearch from "../pages/customer/JobSearch";
export default function SearchInput({ placeholder = "Vị trí tuyển dụng, công ty..." }) {
  const [query, setQuery] = useState("");
  const [suggests, setSuggests] = useState([]);
  const navigate = useNavigate();

  // Debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query.length > 1) {
        fetchSuggest();
      } else {
        setSuggests([]);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const fetchSuggest = async () => {
    try {
      const res = await axios.get(`/customer/job-search?q=${query}`);
      if (res.data.success) {
        setSuggests(res.data.data);
      }
    } catch {}
  };

  const handleSubmit = () => {
    navigate(`/jobs?keyword=${query}`);
    setSuggests([]);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center bg-white rounded-full border px-4 h-12 shadow">
        <input
          type="text"
          className="w-full outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-4 py-2 rounded-full ml-2"
        >
          🔍
        </button>
      </div>

      {/* Autosuggest */}
      {suggests.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white rounded-xl mt-2 shadow-xl z-50">
          {suggests.map((job) => (
            <div
              key={job._id}
              onClick={() => navigate(`/jobs/${job._id}`)}
              className="p-3 hover:bg-gray-100 cursor-pointer"
            >
              <p className="font-medium">{job.title}</p>
              <p className="text-gray-500 text-sm">{job.location}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
