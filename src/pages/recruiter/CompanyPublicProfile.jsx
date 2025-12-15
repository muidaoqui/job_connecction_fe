import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CompanyPublicProfile = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchCompany();
    fetchJobs();
  }, [id]);

  const fetchCompany = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/company/${id}`
      );
      setCompany(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/jobs/company/${id}`
      );
      setJobs(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  if (!company) return <div className="p-10 text-center">Đang tải...</div>;

  return (
    <div className="w-full pb-20">
      {/* Cover */}
      <div className="w-full h-[260px] bg-gray-200">
        <img
          src={
            company.coverImage
              ? `${import.meta.env.VITE_API_URL}${company.coverImage}`
              : "/default-cover.jpg"
          }
          className="w-full h-full object-cover"
        />
      </div>

      {/* Header */}
      <div className="max-w-[1100px] mx-auto -mt-14 flex gap-6 items-end">
        <img
          src={
            company.logo
              ? `${import.meta.env.VITE_API_URL}${company.logo}`
              : "/default-company.png"
          }
          className="w-32 h-32 rounded-xl border-4 border-white shadow"
        />

        <div>
          <h1 className="text-3xl font-bold">{company.name}</h1>
          <p className="text-gray-600 mt-1">{company.tagline}</p>

          <div className="flex gap-4 text-gray-700 mt-3">
            <span>📍 {company.country}</span>
            <span>🏭 {company.industry}</span>
            <span>👥 Quy mô: {company.size}</span>
            {company.website && (
              <a
                href={company.website}
                className="text-blue-600 underline"
                target="_blank"
              >
                🌐 Website
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto mt-10 grid grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="col-span-1 flex flex-col gap-6">
          {/* Tech Stack */}
          <div className="bg-white shadow p-5 rounded-xl">
            <h3 className="font-semibold text-lg mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {company.techs?.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white shadow p-5 rounded-xl">
            <h3 className="font-semibold text-lg mb-3">Mạng xã hội</h3>
            {company.socialLinks?.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                className="block text-blue-600 underline mb-2"
              >
                {link.platform}
              </a>
            ))}
          </div>

          {/* Gallery */}
          <div className="bg-white shadow p-5 rounded-xl">
            <h3 className="font-semibold text-lg mb-3">Hình ảnh công ty</h3>
            <div className="grid grid-cols-2 gap-3">
              {company.galleryImages?.map((img, i) => (
                <img
                  key={i}
                  src={`${import.meta.env.VITE_API_URL}${img}`}
                  className="w-full h-28 rounded-lg object-cover"
                />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-span-2 flex flex-col gap-6">
          <div className="bg-white shadow p-5 rounded-xl">
            <h2 className="text-2xl font-semibold mb-3">Giới thiệu công ty</h2>
            <div
              className="prose max-w-full"
              dangerouslySetInnerHTML={{ __html: company.description }}
            />
          </div>

          <div className="bg-white shadow p-5 rounded-xl">
            <h2 className="text-2xl font-semibold mb-5">Vị trí đang tuyển</h2>

            {jobs.length === 0 ? (
              <p className="text-gray-600">
                Hiện tại công ty chưa đăng tin tuyển dụng.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {jobs.map((job) => (
                  <div
                    key={job._id}
                    className="p-5 border rounded-xl hover:shadow transition"
                  >
                    <h3 className="text-xl font-semibold">{job.title}</h3>
                    <p className="text-gray-600">{job.location}</p>
                    <p className="text-blue-600 mt-1 font-medium">
                      {job.salary}
                    </p>

                    <a
                      href={`/job/${job._id}`}
                      className="text-white bg-blue-600 px-4 py-2 rounded-lg inline-block mt-4"
                    >
                      Xem chi tiết
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPublicProfile;
