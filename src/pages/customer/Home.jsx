import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { message } from "antd";
import useSavedJobs from "../../hooks/useSavedJobs";
import { toast } from "react-toastify";
// import { jwtDecode } from "jwt-decode";

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
  lazyLoad: "ondemand",
};

function Home() {
  const API = import.meta.env.VITE_API_URL;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hotJobs, setHotJobs] = useState([]);
  const [followingCompanies, setFollowingCompanies] = useState([]);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserRole(decoded.role);
      } catch (err) {
        console.log("Token invalid");
      }
    }
  }, []);

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
  const { savedJobsMap, toggleSaveJob } = useSavedJobs();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // // Fetch recommended jobs for candidate
  // useEffect(() => {
  //   const fetchRecommendedJobs = async () => {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       console.log("No token, skipping recommendations");
  //       return;
  //     }

  //     setRecommendedLoading(true);
  //     try {
  //       console.log("Fetching recommendations with token:", token.substring(0, 20) + "...");

  //       const res = await axios.get(
  //         `${API}/api/embeddings/recommendation/jobs?limit=6`,
  //         {
  //           headers: { Authorization: `Bearer ${token}` }
  //         }
  //       );

  //       console.log("Recommendations response:", res.data);

  //       if (res.data.needsProfile) {
  //         setNeedsProfile(true);
  //         setRecommendedJobs([]);
  //       } else {
  //         setNeedsProfile(false);
  //         setRecommendedJobs(res.data.data?.jobs || []);
  //       }
  //     } catch (err) {
  //       console.error("Lỗi khi lấy recommended jobs:", err);
  //       console.error("Error response:", err.response?.data);

  //       if (err.response?.status === 404 || err.response?.status === 401) {
  //         setNeedsProfile(true);
  //       }
  //     } finally {
  //       setRecommendedLoading(false);
  //     }
  //   };

  //   fetchRecommendedJobs();
  // }, [isLoggedIn]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/api/jobs`);
        const data = res.data?.data || [];

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
      if (!token) return;

      try {
        const res = await axios.get(
          "http://localhost:8080/api/candidate/saved-jobs",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const map = {};
        res.data.data.forEach((item) => {
          map[item.jobId._id] = true; // ✅ CHUẨN
        });

        setSavedJobsMap(map);
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
        console.log(
          "Fetching recommendations with token:",
          token.substring(0, 20) + "..."
        );

        const res = await axios.get(
          `${API}/api/embeddings/recommendations/jobs?limit=6`,
          {
            headers: { Authorization: `Bearer ${token}` },
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
  const handleSaveJob = async (jobId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return message.warning("Vui lòng đăng nhập để lưu công việc");
      }

      const isSaved = savedJobsMap[jobId];

      if (isSaved) {
        await axios.post(
          `${API}/api/jobs/${jobId}/unsave`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSavedJobsMap((prev) => ({ ...prev, [jobId]: false }));
        message.success("Đã bỏ lưu công việc");
      } else {
        await axios.post(
          `${API}/api/jobs/${jobId}/save`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSavedJobsMap((prev) => ({ ...prev, [jobId]: true }));
        message.success("Đã lưu công việc");
      }
    } catch (err) {
      console.error("Save job error:", err);
      message.error("Lỗi khi lưu công việc");
    }
  };

  const fetchFollowingCompanies = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/api/company/following`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Lấy ra mảng companyId
      const ids = res.data.data.map((item) => item.companyId._id);
      setFollowingCompanies(ids);
    } catch (error) {
      console.error("Fetch following companies error", error);
    }
  };

  const handleFollow = async (companyId, isFollowing) => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("Vui lòng đăng nhập để theo dõi công ty");
      return;
    }

    try {
      if (isFollowing) {
        await axios.post(
          `${API}/api/company/${companyId}/unfollow`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFollowingCompanies((prev) => prev.filter((id) => id !== companyId));
      } else {
        await axios.post(
          `${API}/api/company/${companyId}/follow`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFollowingCompanies((prev) => [...prev, companyId]);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.info("Bạn đã theo dõi công ty này rồi");
      } else {
        console.error("Follow error:", error);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchFollowingCompanies();
    }
  }, []);

  return (
    <div className="w-full">
      {/* ========== SLIDER TOP COMPANIES ========== */}
      {isLoggedIn && userRole === "candidate" && (
        <div className="max-w-6xl mx-auto mt-8 px-6">
          <div
            className="relative rounded-3xl overflow-hidden shadow-xl bg-cover bg-center"
            style={{
              backgroundImage: "url('/src/assets/recruiter-bg.png')",
            }}
          >
            {/* OVERLAY XANH */}
            <div className="absolute inset-0 bg-blue-700/40"></div>

            <div className="relative z-10 p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              {/* TEXT */}
              <div className="bg-blue-900/60 backdrop-blur-md rounded-2xl p-6 max-w-xl">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
                  Bạn đang tuyển dụng nhân tài?
                </h2>
                <p className="text-slate-200 text-lg leading-relaxed">
                  Tạo hồ sơ nhà tuyển dụng, đăng tin tuyển dụng và tiếp cận ứng
                  viên chất lượng chỉ trong vài phút.
                </p>
              </div>

              {/* BUTTON */}
              <button
                onClick={() => (window.location.href = "/recruiter/profile")}
                className="bg-white text-blue-700 font-bold px-8 py-4 rounded-2xl shadow-lg hover:scale-105 transition"
              >
                🚀 Trở thành Nhà tuyển dụng
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="w-full my-4 relative">
        <Slider {...sliderSettings}>
          {topCompaniesLoading ? (
            <div className="flex justify-center items-center h-[400px]">
              <p>Đang tải công ty...</p>
            </div>
          ) : topCompanies.length === 0 ? (
            <div className="flex justify-center items-center h-[400px]">
              <p>Hiện chưa có công ty</p>
            </div>
          ) : (
            topCompanies.map((c) => (
              <div key={c._id} className="px-2">
                <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer">
                  {c.coverImage && (
                    <img
                      src={c.coverImage}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
                    {c.logo && (
                      <img
                        src={c.logo}
                        alt={c.name}
                        className="h-24 object-contain mb-4"
                      />
                    )}
                    <h2 className="text-3xl font-bold text-white mb-4">
                      {c.name}
                    </h2>
                    <button
                      onClick={() =>
                        (window.location.href = `/company/${c._id}`)
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                    >
                      Xem Chi Tiết
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </Slider>
      </div>

      {/* ========== COMPANIES LIST ========== */}
      <div className="bg-gradient-to-b from-white to-blue-100 my-4 px-10">
        <h1 className="text-3xl text-blue-600 font-bold ml-10">
          NHÀ TUYỂN DỤNG NỔI BẬT
        </h1>

        <div className="flex gap-4 justify-around my-6 py-4 flex-wrap">
          {companiesLoading ? (
            <p className="text-gray-500 w-full text-center">
              Đang tải công ty...
            </p>
          ) : companies.length === 0 ? (
            <p className="text-gray-500 w-full text-center">
              Hiện chưa có công ty
            </p>
          ) : (
            companies.map((company) => (
              <button
                key={company.companyId}
                onClick={() =>
                  (window.location.href = `/company/${company._id}`)
                }
                className="hover:scale-110 transition-transform duration-300 flex items-center justify-center p-2 rounded-lg hover:bg-white hover:shadow-md"
                title={company.name}
              >
                {company.logo ? (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-16 object-contain"
                  />
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

      <section className="px-10 my-10">
        <h1 className="text-3xl text-blue-600 font-bold mb-6">
          🔥 CÔNG VIỆC HOT HÔM NAY
        </h1>

        <div className="grid grid-cols-3 gap-6">
          {hotJobs.map((job) => (
            <div
              key={job._id}
              onClick={() => (window.location.href = `/job/${job._id}`)}
              className="border rounded-xl p-5 bg-white shadow hover:shadow-lg cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={job.companyId?.logo}
                  className="w-12 h-12 object-contain border rounded-md"
                />
                <div>
                  <h3 className="font-bold text-blue-600">{job.title}</h3>
                  <p className="text-sm font-semibold">{job.companyId?.name}</p>
                </div>
              </div>

              <p>📍 {job.location}</p>
              <p className="font-bold text-blue-600">{job.salary}</p>

              <div className="flex justify-between mt-4 border-t pt-3">
                <span className="text-xs text-gray-500">
                  {new Date(job.createdAt).toLocaleDateString("vi-VN")}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSaveJob(job._id);
                  }}
                >
                  {savedJobsMap[job._id] ? "❤️" : "🤍"}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10 mb-10">
          <button
            onClick={() => (window.location.href = "/job-search")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md"
          >
            Xem Tất Cả Công Việc →
          </button>
        </div>
      </section>

      {/* ========== RECOMMENDED JOBS ========== */}
      {isLoggedIn && (
        <section className="px-10 my-10 bg-green-50 py-10">
          <h1 className="text-3xl text-green-600 font-bold mb-6">
            ✨ CÔNG VIỆC GỢI Ý CHO BẠN
          </h1>

          <div className="grid grid-cols-3 gap-6">
            {recommendedJobs.map((job) => (
              <div
                key={job._id}
                onClick={() => (window.location.href = `/job/${job._id}`)}
                className="border-2 border-green-200 rounded-xl p-5 bg-white shadow hover:shadow-lg cursor-pointer relative"
              >
                {job.score && (
                  <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                    {Math.round(job.score * 100)}% Phù hợp
                  </span>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={job.companyLogo}
                    className="w-12 h-12 object-contain border rounded-md"
                  />
                  <div>
                    <h3 className="font-bold text-green-600">{job.title}</h3>
                    <p className="text-sm font-semibold">{job.companyName}</p>
                  </div>
                </div>

                <p>📍 {job.location}</p>
                <p className="font-bold text-green-600">{job.salary}</p>
                <div className="flex justify-between mt-4 border-t pt-3">
                  <span className="text-xs text-gray-500">
                    {new Date(job.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSaveJob(job._id);
                    }}
                  >
                    {savedJobsMap[job._id] ? "❤️" : "🤍"}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div>
            {!needsProfile && recommendedJobs.length > 0 && (
              <div className="text-center mt-6 mb-10">
                <button
                  onClick={() => (window.location.href = "/job-search")}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md"
                >
                  Xem Thêm Công Việc →
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========== COMPANIES GRID FULL ========== */}
      <div className="flex flex-col gap-2 my-4 px-10 min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-3xl text-blue-600 font-bold ml-10 mt-6">
          🏢 CÔNG TY NỔI BẬT
        </h1>
        <p className="ml-10 text-gray-600 mb-4">
          Khám phá các công ty hàng đầu đang tuyển dụng
        </p>

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
                onClick={() =>
                  (window.location.href = `/company/${company._id}`)
                }
              >
                {company.logo && (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-full h-20 object-contain mb-4"
                  />
                )}
                <h2
                  onClick={() =>
                    (window.location.href = `/company/${company._id}`)
                  }
                  className="cursor-pointer text-xl font-bold text-blue-600"
                >
                  {company.name}
                </h2>

                <p className="text-gray-600">{company.industry}</p>

                <div className="flex gap-3 text-sm text-gray-700 mt-3 justify-between">
                  <div className="flex flex-col">
                    {company.country && <span>📍 {company.country}</span>}
                    {company.size && <span>👥 {company.size}</span>}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollow(
                        company._id,
                        followingCompanies.includes(company._id)
                      );
                    }}
                    className={`mt-4 w-1/2 py-2 rounded-lg font-semibold transition ${
                      followingCompanies.includes(company._id)
                        ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {followingCompanies.includes(company._id)
                      ? "Bỏ theo dõi"
                      : "Theo dõi"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="text-center mt-10 mb-10">
          <button
            onClick={() => (window.location.href = "/companies")}
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
