import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { message } from "antd";

// Nút mũi tên trái
function PrevArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute left-0 z-10 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 top-1/2 -translate-y-1/2"
    >
      <MdKeyboardArrowLeft size={30} />
    </button>
  );
}

// Nút mũi tên phải
function NextArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute right-0 z-10 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 top-1/2 -translate-y-1/2"
    >
      <MdKeyboardArrowRight size={30} />
    </button>
  );
}

const sliderSettings = {
  dots: true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  speed: 600,
  slidesToShow: 1,
  slidesToScroll: 1,
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />,
};

function Home() {
  const API = import.meta.env.VITE_API_URL;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hotJobs, setHotJobs] = useState([]);

  // Recommended jobs state
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [companies, setCompanies] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const [topRecruiters, setTopRecruiters] = useState([]);

  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [topCompaniesLoading, setTopCompaniesLoading] = useState(false);
  const [recruitersLoading, setRecruitersLoading] = useState(false);

  const [savedJobsMap, setSavedJobsMap] = useState({});

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Fetch recommended jobs for candidate
  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token, skipping recommendations");
        return;
      }

      setRecommendedLoading(true);
      try {
        console.log("Fetching recommendations with token:", token.substring(0, 20) + "...");

        const res = await axios.get(
          `${API}/api/embeddings/recommendation/jobs?limit=6`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        console.log("Recommendations response:", res.data);

        if (res.data.needsProfile) {
          setNeedsProfile(true);
          setRecommendedJobs([]);
        } else {
          setNeedsProfile(false);
          setRecommendedJobs(res.data.data?.jobs || []);
        }
      } catch (err) {
        console.error("Lỗi khi lấy recommended jobs:", err);
        console.error("Error response:", err.response?.data);

        if (err.response?.status === 404 || err.response?.status === 401) {
          setNeedsProfile(true);
        }
      } finally {
        setRecommendedLoading(false);
      }
    };

    fetchRecommendedJobs();
  }, [isLoggedIn]);

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/api/jobs`);
        const data = res.data || [];
        setJobs(data);
        setHotJobs(data.slice(0, 6));
      } catch (err) {
        console.error("Lỗi khi lấy jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Load saved jobs when logged in
  useEffect(() => {
    const loadSavedJobs = async () => {
      const token = localStorage.getItem("token");

      try {
        const res = await axios.get(
          "http://localhost:8080/api/candidate/saved-jobs",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSavedJobsMap(res.data.savedJobs || []);
      } catch (err) {
        console.error("Error loading saved jobs", err);
      }
    };
    loadSavedJobs();
  }, []);

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      setCompaniesLoading(true);
      try {
        const res = await axios.get(`${API}/api/company?limit=6`);
        const data = res.data?.data || res.data?.companies || [];
        setCompanies(data);
      } catch (err) {
        console.error("Lỗi khi lấy companies:", err);
      } finally {
        setCompaniesLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch top companies (banner slider)
  useEffect(() => {
    const fetchTopCompanies = async () => {
      setTopCompaniesLoading(true);
      try {
        const res = await axios.get(`${API}/api/company?limit=6`);
        const data = res.data?.data || res.data?.companies || [];
        setTopCompanies(data);
      } catch (err) {
        console.error("Lỗi khi lấy top companies:", err);
      } finally {
        setTopCompaniesLoading(false);
      }
    };
    fetchTopCompanies();
  }, []);

  // Fetch recruiters
  useEffect(() => {
    const fetchTopRecruiters = async () => {
      setRecruitersLoading(true);
      try {
        const res = await axios.get(`${API}/api/recruiter/top?limit=6`);
        setTopRecruiters(res.data?.recruiters || []);
      } catch (err) {
        console.error("Lỗi khi lấy recruiters:", err);
      } finally {
        setRecruitersLoading(false);
      }
    };
    fetchTopRecruiters();
  }, []);

  const handleSaveJob = async (jobId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return message.warning("Vui lòng đăng nhập để lưu công việc");
      }

      const isSaved = savedJobsMap[jobId];

      if (isSaved) {
        await axios.post(`${API}/api/jobs/${jobId}/unsave`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedJobsMap((prev) => ({ ...prev, [jobId]: false }));
        message.success("Đã bỏ lưu công việc");
      } else {
        await axios.post(`${API}/api/jobs/${jobId}/save`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedJobsMap((prev) => ({ ...prev, [jobId]: true }));
        message.success("Đã lưu công việc");
      }
    } catch (err) {
      console.error("Save job error:", err);
      message.error("Lỗi khi lưu công việc");
    }
  };

  return (
    <div className="w-full">

      {/* ========== SLIDER TOP COMPANIES ========== */}
      <div className="w-full my-4 relative">
        <Slider {...sliderSettings}>
          {topCompaniesLoading ? (
            <div className="flex justify-center items-center h-[400px]">
              <p className="text-gray-500">Đang tải công ty...</p>
            </div>
          ) : topCompanies.length === 0 ? (
            <div className="flex justify-center items-center h-[400px]">
              <p className="text-gray-500">Hiện chưa có công ty</p>
            </div>
          ) : (
            topCompanies.map((company) => (
              <div key={company._id} className="px-2">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 h-[400px] rounded-2xl shadow-lg flex flex-col items-center justify-center p-8 text-center hover:shadow-xl transition cursor-pointer">
                  {company.logo && (
                    <img src={company.logo} alt={company.name} className="h-24 object-contain mb-6" />
                  )}
                  <h2 className="text-3xl font-bold text-blue-600 mb-3">{company.name}</h2>

                  {company.industry && (<p className="text-lg text-gray-600 mb-2">{company.industry}</p>)}
                  {company.description && (<p className="text-gray-600 max-w-md mb-4">{company.description}</p>)}

                  <div className="flex gap-6 justify-center text-sm text-gray-700 mb-6">
                    {company.country && <span>📍 {company.country}</span>}
                    {company.size && <span>👥 {company.size}</span>}
                  </div>

                  <button
                    onClick={(e) => { e.stopPropagation(); window.location.href = `/company/${company._id}`; }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                  >
                    Xem Chi Tiết
                  </button>
                </div>
              </div>
            ))
          )}
        </Slider>
      </div>

      {/* ========== COMPANIES LIST ========== */}
      <div className="bg-gradient-to-b from-white to-blue-100 my-4 px-10">
        <h1 className="text-3xl text-blue-600 font-bold ml-10">NHÀ TUYỂN DỤNG NỔI BẬT</h1>

        <div className="flex gap-4 justify-around my-6 py-4 flex-wrap">
          {companiesLoading ? (
            <p className="text-gray-500 w-full text-center">Đang tải công ty...</p>
          ) : companies.length === 0 ? (
            <p className="text-gray-500 w-full text-center">Hiện chưa có công ty</p>
          ) : (
            companies.map((company) => (
              <button
                key={company._id}
                onClick={() => window.location.href = `/company/${company._id}`}
                className="hover:scale-110 transition-transform duration-300 flex items-center justify-center p-2 rounded-lg hover:bg-white hover:shadow-md"
                title={company.name}
              >
                {company.logo ? (
                  <img src={company.logo} alt={company.name} className="h-16 object-contain" />
                ) : (
                  <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center text-sm font-semibold text-gray-600">
                    {company.name.substring(0, 3)}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>
      {/* ========== Recommendations JOBS ========== */}

      {/* ========== HOT JOBS ========== */}
      <div className="flex flex-col gap-2 my-4 px-10 min-h-screen">
        <h1 className="text-3xl text-blue-600 font-bold ml-10">🔥 CÔNG VIỆC HOT HÔM NAY</h1>
        <p className="ml-10 text-gray-600">Những cơ hội việc làm được tìm kiếm nhiều nhất</p>

        <div className="grid grid-cols-3 gap-6 mt-6">

          {loading ? (
            <p className="text-gray-500">Đang tải công việc...</p>
          ) : hotJobs.length === 0 ? (
            <p className="text-gray-500">Hiện chưa có công việc hot.</p>
          ) : (
            hotJobs.map((job) => (
              <div
                key={job._id}
                className="rounded-xl border border-gray-200 p-5 bg-white shadow-sm hover:shadow-lg transition cursor-pointer"
                onClick={() => window.location.href = `/job/${job._id}`}
              >
                {job.saveCount > 50 && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                    🔥 HOT ({job.saveCount})
                  </div>
                )}

                <h3 className="text-lg font-bold text-blue-600 mb-1">{job.title}</h3>
                <p className="text-sm font-semibold text-gray-700">
                  {job.companyId?.name || job.recruiterId?.name || "Nhà tuyển dụng"}
                </p>

                <div className="space-y-2 my-4">
                  <p className="text-sm text-gray-700">📍 {job.location || "Chưa rõ"}</p>
                  <p className="text-blue-600 font-bold">{job.salary || "Thương lượng"}</p>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-xs text-gray-500">
                    {new Date(job.createdAt).toLocaleDateString("vi-VN")}
                  </span>

                  <button
                    onClick={(e) => handleSaveJob(job._id, e)}
                    className={`px-3 py-1 rounded-lg text-sm transition ${savedJobsMap[job._id]
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {savedJobsMap[job._id] ? "❤️ Đã Lưu" : "🤍 Lưu"}
                  </button>
                </div>
              </div>
            ))
          )}

        </div>

        <div className="text-center mt-10 mb-10">
          <button
            onClick={() => window.location.href = "/job-search"}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md"
          >
            Xem Tất Cả Công Việc →
          </button>
        </div>
      </div>

      {/* ========== RECOMMENDED JOBS (Only for logged in candidates) ========== */}
      {isLoggedIn && (
        <div className="flex flex-col gap-2 my-4 px-10 min-h-[400px] bg-gradient-to-b from-green-50 to-white">
          <h1 className="text-3xl text-green-600 font-bold ml-10 mt-6">✨ CÔNG VIỆC GỢI Ý CHO BẠN</h1>
          <p className="ml-10 text-gray-600">Dựa trên hồ sơ và kỹ năng của bạn</p>

          <div className="grid grid-cols-3 gap-6 mt-6">
            {recommendedLoading ? (
              <p className="text-gray-500 col-span-3 text-center">Đang tải gợi ý công việc...</p>
            ) : needsProfile ? (
              <div className="col-span-3 flex flex-col items-center justify-center py-12 px-6 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-bold text-yellow-700 mb-2">Hoàn thiện hồ sơ để nhận gợi ý công việc</h3>
                <p className="text-gray-600 text-center mb-6 max-w-lg">
                  Hãy cập nhật đầy đủ thông tin về học vấn, kinh nghiệm làm việc, dự án và kỹ năng của bạn.
                  Hệ thống sẽ tự động gợi ý những công việc phù hợp nhất với bạn!
                </p>
                <button
                  onClick={() => window.location.href = "/customer/mysaramin"}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md transition"
                >
                  Cập Nhật Hồ Sơ Ngay →
                </button>
              </div>
            ) : recommendedJobs.length === 0 ? (
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">Hiện chưa có công việc phù hợp với hồ sơ của bạn.</p>
              </div>
            ) : (
              recommendedJobs.map((job) => (
                <div
                  key={job._id}
                  className="rounded-xl border-2 border-green-200 p-5 bg-white shadow-sm hover:shadow-lg transition cursor-pointer relative"
                  onClick={() => window.location.href = `/job/${job._id}`}
                >
                  {/* Match score badge */}
                  {job.score && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow">
                      ⭐ {Math.round(job.score * 100)}% phù hợp
                    </div>
                  )}

                  <h3 className="text-lg font-bold text-green-700 mb-1">{job.title}</h3>
                  <p className="text-sm font-semibold text-gray-700">
                    {job.companyId?.name || job.recruiterId?.name || "Nhà tuyển dụng"}
                  </p>

                  <div className="space-y-2 my-4">
                    <p className="text-sm text-gray-700">📍 {job.location || "Chưa rõ"}</p>
                    <p className="text-green-600 font-bold">{job.salary || "Thương lượng"}</p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-xs text-gray-500">
                      {new Date(job.createdAt).toLocaleDateString("vi-VN")}
                    </span>

                    <button
                      onClick={(e) => handleSaveJob(job._id, e)}
                      className={`px-3 py-1 rounded-lg text-sm transition ${savedJobsMap[job._id]
                          ? "bg-red-100 text-red-600"
                          : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {savedJobsMap[job._id] ? "❤️ Đã Lưu" : "🤍 Lưu"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {!needsProfile && recommendedJobs.length > 0 && (
            <div className="text-center mt-6 mb-10">
              <button
                onClick={() => window.location.href = "/job-search"}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md"
              >
                Xem Thêm Công Việc →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========== COMPANIES GRID FULL ========== */}
      <div className="flex flex-col gap-2 my-4 px-10 min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-3xl text-blue-600 font-bold ml-10 mt-6">🏢 CÔNG TY NỔI BẬT</h1>
        <p className="ml-10 text-gray-600 mb-4">Khám phá các công ty hàng đầu đang tuyển dụng</p>

        <div className="grid grid-cols-3 gap-6 mt-6">
          {companiesLoading ? (
            <p className="text-gray-500">Đang tải công ty...</p>
          ) : companies.length === 0 ? (
            <p className="text-gray-500">Hiện chưa có công ty.</p>
          ) : (
            companies.map((company) => (
              <div
                key={company._id}
                className="border rounded-xl p-6 bg-white shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => window.location.href = `/company/${company._id}`}
              >
                {company.logo && (
                  <img src={company.logo} alt={company.name} className="h-20 object-contain mb-4" />
                )}
                <h2 className="text-xl font-bold text-blue-600">{company.name}</h2>
                <p className="text-gray-600">{company.industry}</p>

                <div className="flex gap-3 text-sm text-gray-700 mt-3">
                  {company.country && <span>📍 {company.country}</span>}
                  {company.size && <span>👥 {company.size}</span>}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="text-center mt-10 mb-10">
          <button
            onClick={() => window.location.href = "/companies"}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md"
          >
            Xem Tất Cả Công Ty →
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
