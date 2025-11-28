import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { j1, j2, j3, j4, j5 } from "../../assets/jobs";
import { l1, l2, l3, l4, l5, l6 } from "../../assets/jobslogo";

// Nút mũi tên trái
function PrevArrow(props) {
  const { onClick } = props;
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
function NextArrow(props) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-0 z-10 text-white bg-black/50 hover:bg-black/70 rounded-full p-2 top-1/2 -translate-y-1/2"
    >
      <MdKeyboardArrowRight size={30} />
    </button>
  );
}

// Cấu hình slider
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
  // Danh sách ảnh cần hiển thị
  const jobImages = [j1, j2, j3, j4, j5];
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hotJobs, setHotJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [topCompanies, setTopCompanies] = useState([]);
  const [topRecruiters, setTopRecruiters] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [topCompaniesLoading, setTopCompaniesLoading] = useState(false);
  const [recruitersLoading, setRecruitersLoading] = useState(false);
  const [followingMap, setFollowingMap] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:8080/api/jobs");
        setJobs(res.data || []);
        // Hot jobs are already sorted by saveCount in API
        setHotJobs((res.data || []).slice(0, 6));
      } catch (err) {
        console.error("Lỗi khi lấy jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      setCompaniesLoading(true);
      try {
        const res = await axios.get("http://localhost:8080/api/company?limit=6");
        // Backend returns { success: true, data: [...] } or { success: true, companies: [...] }
        const companiesData = res.data?.data || res.data?.companies || [];
        setCompanies(companiesData);
      } catch (err) {
        console.error("Lỗi khi lấy companies:", err);
      } finally {
        setCompaniesLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchTopCompanies = async () => {
      setTopCompaniesLoading(true);
      try {
        const res = await axios.get("http://localhost:8080/api/company?limit=6");
        // Backend returns { success: true, data: [...] } or { success: true, companies: [...] }
        const companiesData = res.data?.data || res.data?.companies || [];
        setTopCompanies(companiesData);
      } catch (err) {
        console.error("Lỗi khi lấy top companies:", err);
      } finally {
        setTopCompaniesLoading(false);
      }
    };
    fetchTopCompanies();
  }, []);

  useEffect(() => {
    const fetchTopRecruiters = async () => {
      setRecruitersLoading(true);
      try {
        const res = await axios.get("http://localhost:8080/api/recruiter/top?limit=6");
        setTopRecruiters(res.data?.recruiters || []);
      } catch (err) {
        console.error("Lỗi khi lấy recruiters:", err);
      } finally {
        setRecruitersLoading(false);
      }
    };
    fetchTopRecruiters();
  }, []);

  return (
    <div className="w-full">
      <div className="w-full my-4 relative">
        <Slider {...sliderSettings}>
          {topCompaniesLoading && (
            <div className="flex justify-center items-center h-[400px]">
              <p className="text-gray-500">Đang tải công ty...</p>
            </div>
          )}
          {!topCompaniesLoading && topCompanies.length === 0 && (
            <div className="flex justify-center items-center h-[400px]">
              <p className="text-gray-500">Hiện chưa có công ty</p>
            </div>
          )}
          {!topCompaniesLoading && topCompanies.map((company) => (
            <div key={company._id} className="px-2">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 h-[400px] rounded-2xl shadow-lg flex flex-col items-center justify-center p-8 text-center hover:shadow-xl transition cursor-pointer">
                {company.logo && (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-24 object-contain mb-6"
                  />
                )}
                <h2 className="text-3xl font-bold text-blue-600 mb-3">{company.name}</h2>
                {company.industry && (
                  <p className="text-lg text-gray-600 mb-2">{company.industry}</p>
                )}
                {company.description && (
                  <p className="text-gray-600 max-w-md mb-4">{company.description}</p>
                )}
                <div className="flex gap-6 justify-center text-sm text-gray-700 mb-6">
                  {company.country && <span>📍 {company.country}</span>}
                  {company.size && <span>👥 {company.size}</span>}
                </div>
                {company._id && (
                  <button
                    onClick={(e) => { e.stopPropagation(); window.location.href = `/customer/company/${company._id}`; }}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                  >
                    Xem Chi Tiết
                  </button>
                )}
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <div className="bg-gradient-to-b from-white to-blue-100 my-4 px-10">
        <h1 className="text-3xl text-blue-600 font-bold ml-10">NHÀ TUYỂN DỤNG NỔI BẬT</h1>
        <div className="flex gap-4 justify-around my-6 py-4 flex-wrap">
          {companiesLoading && <p className="text-gray-500 w-full text-center">Đang tải công ty...</p>}
          {!companiesLoading && companies.length === 0 && <p className="text-gray-500 w-full text-center">Hiện chưa có công ty</p>}
          {!companiesLoading && companies.map((company) => (
            <button
              key={company._id}
              onClick={() => window.location.href = '/customer/people'}
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
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 my-4 px-10 min-h-screen">
        <h1 className="text-3xl text-blue-600 font-bold ml-10">
          🔥 CÔNG VIỆC HOT HÔM NAY
        </h1>
        <p className="ml-10 text-gray-600">
          Những cơ hội việc làm được tìm kiếm nhiều nhất - Đừng bỏ lỡ!
        </p>
        <div className="grid grid-cols-3 gap-6 mt-6">
          {loading && <p className="text-gray-500">Đang tải công việc...</p>}
          {!loading && hotJobs.length === 0 && <p className="text-gray-500">Hiện chưa có công việc hot.</p>}
          {!loading && hotJobs.map((job) => (
            <div key={job._id} className="rounded-xl border border-gray-200 p-5 bg-white shadow-sm hover:shadow-lg transition-all duration-300 relative cursor-pointer group" onClick={() => window.location.href = `/customer/job/${job._id}`}>
              {job.saveCount > 50 && (
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  🔥 HOT ({job.saveCount})
                </div>
              )}
              <div className="flex justify-between items-start gap-3 mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-blue-600 group-hover:text-blue-700 mb-1">{job.title}</h3>
                  <p className="text-sm font-semibold text-gray-700">
                    {job.companyId?.name || job.recruiterId?.name || 'Nhà tuyển dụng'}
                  </p>
                </div>
              </div>

              {job.companyId && (
                <div className="mb-3 pb-3 border-b border-gray-200">
                  <div className="flex flex-wrap gap-2">
                    {job.companyId.industry && (
                      <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                        {job.companyId.industry}
                      </span>
                    )}
                    {job.companyId.country && (
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        📍 {job.companyId.country}
                      </span>
                    )}
                    {job.companyId.size && (
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        👥 {job.companyId.size}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-sm">📍</span>
                  <p className="text-sm text-gray-700">{job.location || 'Địa điểm chưa rõ'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 text-sm font-bold">{job.salary || 'Thương lượng'}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-500">{new Date(job.createdAt).toLocaleDateString('vi-VN')}</span>
                <button onClick={(e) => { e.stopPropagation(); window.location.href = `/customer/job/${job._id}`; }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg text-sm font-semibold transition">Xem Chi Tiết</button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10 mb-10">
          <button onClick={() => window.location.href = '/customer/job-search'} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition shadow-md">
            Xem Tất Cả Công Việc →
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 my-4 px-10 min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <h1 className="text-3xl text-blue-600 font-bold ml-10 mt-6">
          🏢 CÔNG TY NỔI BẬT
        </h1>
        <p className="ml-10 text-gray-600 mb-4">
          Khám phá các công ty hàng đầu đang tuyển dụng
        </p>
        <div className="grid grid-cols-3 gap-6 mt-6">
          {companiesLoading && <p className="text-gray-500">Đang tải công ty...</p>}
          {!companiesLoading && companies.length === 0 && <p className="text-gray-500">Hiện chưa có công ty.</p>}
          {!companiesLoading && companies.map((company) => (
            <div key={company._id} className="rounded-xl border border-gray-200 p-6 bg-white shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group" onClick={() => window.location.href = `/customer/companies`}>
              <div className="flex flex-col items-center text-center gap-4">
                {company.logo && (
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-20 object-contain group-hover:scale-110 transition-transform"
                  />
                )}
                <div className="w-full">
                  <h3 className="text-xl font-bold text-blue-600 mb-2 group-hover:text-blue-700">{company.name}</h3>
                  {company.industry && (
                    <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
                      {company.industry}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-2 w-full text-sm text-gray-700">
                  {company.country && (
                    <div className="flex items-center justify-center gap-2">
                      <span>📍</span>
                      <span>{company.country}</span>
                    </div>
                  )}
                  {company.size && (
                    <div className="flex items-center justify-center gap-2">
                      <span>👥</span>
                      <span>{company.size}</span>
                    </div>
                  )}
                </div>

                {company.description && (
                  <p className="text-xs text-gray-600 line-clamp-2">{company.description}</p>
                )}

                <div className="flex gap-3 w-full pt-4 border-t border-gray-200">
                  {company._id && (
                    <button
                      onClick={(e) => { e.stopPropagation(); window.location.href = `/customer/company/${company._id}`; }}
                      className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-semibold transition"
                    >
                      Xem Chi Tiết
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <button onClick={() => window.location.href = '/customer/people'} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition shadow-md">
            Xem Tất Cả Công Ty →
          </button>
        </div>
      </div>
      {/* 'Nhân viên tuyển dụng hàng đầu' section removed as requested */}

    </div>
  );
}

export default Home;