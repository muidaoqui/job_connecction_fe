import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import Modal from "../../components/Modal";

const CompanyPublicProfile = () => {
  const { companyId } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [cvModal, setCvModal] = useState({ open: false, content: "", title: "" });
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, selectedText: "" });
  const [translating, setTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState("");

  // Auth & current user (if any)
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const API = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetchCompany();
  }, [companyId]);

  const fetchCompany = async () => {
    setLoading(true);
    try {
      const companyRes = await axios.get(`${API}/api/company/${companyId}`);
      setCompany(companyRes.data?.company || companyRes.data?.data || null);

      const jobsRes = await axios.get(`${API}/api/jobs?companyId=${companyId}`);
      setJobs(Array.isArray(jobsRes.data?.data) ? jobsRes.data.data.slice(0, 6) : []);

      const recruitersRes = await axios.get(`${API}/api/recruiter?companyId=${companyId}`);
      setRecruiters(
        Array.isArray(recruitersRes.data?.recruiters)
          ? recruitersRes.data.recruiters
          : []
      );
    } catch (error) {
      console.error("❌ Lỗi khi lấy chi tiết công ty:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id && token) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/jobs/recruiter/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setStats(res.data))
        .catch((err) => console.log(err));
    }
  }, [user?._id, token]);

  // Fetch applicants for this company when the logged-in recruiter views their company page
  const fetchApplicants = async () => {
    if (!token) return;
    try {
      setLoadingApplicants(true);
      const res = await axios.get(`${API}/api/recruiter/applications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const apps = res.data.apps || res.data.data || [];

      // Filter to this company (defensive). Many endpoints populate jobId or company differently.
      const filtered = apps.filter((a) => {
        const jobCompanyId = a.jobId?.company || a.jobId?.companyId || a.jobId?.company?._id || a.jobId?.companyId || a.jobId?._id;
        if (jobCompanyId) return String(jobCompanyId) === String(companyId);
        if (a.company) return String(a.company._id) === String(companyId);
        return false;
      });

      setApplicants(filtered);
    } catch (err) {
      console.log("❌ Lỗi khi lấy ứng viên cho công ty:", err);
      setApplicants([]);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      await axios.put(
        `${API}/api/jobs/applications/${appId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchApplicants();
    } catch (err) {
      console.log("Lỗi cập nhật trạng thái:", err);
    }
  };

  // VIEW CV (reuses recruiter page logic)
  const handleViewCV = async (filePath, name) => {
    if (!filePath) return alert("Không có file CV");
    try {
      setCvModal({ open: true, content: "Đang tải CV...", title: name || "CV Ứng viên" });
      const res = await axios.post(
        `${API}/api/rags/read-pdf`,
        { filePath },
        { headers: { "Content-Type": "application/json" } }
      );
      const { structure } = res.data;
      let content = "";

      if (structure?.contactInfo) {
        content += `<div style="margin-bottom:16px"><b>Thông tin liên hệ:</b><br/>`;
        Object.entries(structure.contactInfo).forEach(([key, val]) => {
          if (val && Array.isArray(val) && val.length > 0) {
            content += `<span style="background: #fef08a; color: #b45309; font-weight: bold">${key}: ${val.join(", ")}</span><br/>`;
          } else if (val) {
            content += `<span style="background: #fef08a; color: #b45309; font-weight: bold">${key}: ${val}</span><br/>`;
          }
        });
        content += `</div>`;
      }

      if (structure?.sections) {
        structure.sections.forEach((section) => {
          if (section.title) {
            content += `<div style="margin-top:18px;margin-bottom:6px;font-size:1.1em;color:#2563eb;font-weight:bold">${section.title}</div>`;
          }
          if (section.content) {
            content += `<div style="margin-bottom:10px;white-space:pre-line">${section.content}</div>`;
          }
        });
      } else {
        content = "Không có dữ liệu section trong CV";
      }

      setCvModal({ open: true, content, title: name || "CV Ứng viên" });
    } catch (err) {
      setCvModal({ open: true, content: "Không thể đọc CV: " + (err?.response?.data?.message || err.message), title: name || "CV Ứng viên" });
    }
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText.length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setContextMenu({ show: true, x: rect.left + rect.width / 2, y: rect.top - 10, selectedText });
    } else {
      setContextMenu({ show: false, x: 0, y: 0, selectedText: "" });
    }
  };

  const handleTranslate = async () => {
    if (!contextMenu.selectedText) return;
    try {
      setTranslating(true);
      const res = await axios.post(
        `${API}/api/llm/translate`,
        { text: contextMenu.selectedText, input_language: "English", output_language: "Vietnamese" },
        { headers: { "Content-Type": "application/json" } }
      );
      setTranslationResult(`<div style="background:#dbeafe;padding:12px;border-radius:8px;margin-top:10px;border-left:4px solid #3b82f6"><div style="font-weight:bold;color:#1e40af;margin-bottom:6px">📝 Bản dịch:</div><div style="color:#1e3a8a">${res.data.translation || res.data.result || "Không có kết quả"}</div></div>`);
      setContextMenu({ show: false, x: 0, y: 0, selectedText: "" });
    } catch (err) {
      alert("Lỗi khi dịch: " + (err?.response?.data?.message || err.message));
    } finally {
      setTranslating(false);
    }
  };

  const handleSummarize = async () => {
    if (!contextMenu.selectedText) return;
    try {
      setTranslating(true);
      const res = await axios.post(
        `${API}/api/llm/summarize`,
        { text: contextMenu.selectedText, language: "English" },
        { headers: { "Content-Type": "application/json" } }
      );

      let displayContent = `<div style="background:#fef3c7;padding:12px;border-radius:8px;margin-top:10px;border-left:4px solid #f59e0b"><div style="font-weight:bold;color:#92400e;margin-bottom:6px">✨ Tóm tắt (Tiếng Việt):</div><div style="color:#78350f">${res.data.result || "Không có kết quả"}</div>`;
      if (res.data.original_summary && res.data.language !== "Vietnamese") {
        displayContent += `<div style="margin-top:10px;padding-top:10px;border-top:1px solid #fcd34d"><div style="font-weight:bold;color:#92400e;margin-bottom:6px">📄 Bản gốc (${res.data.language}):</div><div style="color:#78350f;font-size:0.9em">${res.data.original_summary}</div></div>`;
      }
      displayContent += `</div>`;
      setTranslationResult(displayContent);
      setContextMenu({ show: false, x: 0, y: 0, selectedText: "" });
    } catch (err) {
      alert("Lỗi khi tóm tắt: " + (err?.response?.data?.message || err.message));
    } finally {
      setTranslating(false);
    }
  };

  useEffect(() => {
    // Only fetch applicants when company is loaded and token exists
    if (token && company && String(company._id) === String(companyId)) {
      fetchApplicants();
    }
  }, [token, company, companyId]);

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

          {/* Applicants (visible to authenticated recruiter who owns this company) */}
          {token && String(company._id) === String(companyId) && (
            <div className="bg-white shadow p-5 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Ứng viên</h2>
                <a href="/recruiter/applicants" className="text-sm text-blue-600 underline">Xem tất cả</a>
              </div>

              {loadingApplicants && <p className="text-gray-600">Đang tải dữ liệu...</p>}

              {!loadingApplicants && applicants.length === 0 && (
                <p className="text-gray-600">Chưa có ứng viên cho công ty này.</p>
              )}

              {!loadingApplicants && applicants.length > 0 && (
                <div className="overflow-x-auto shadow rounded-xl bg-white p-2 border border-gray-200">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                        <th className="p-3">Ứng viên</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Công việc</th>
                        <th className="p-3">Trạng thái</th>
                        <th className="p-3">Hành động</th>
                        <th className="p-3">CV</th>
                      </tr>
                    </thead>

                    <tbody>
                      {applicants.map((app) => (
                        <tr key={app._id} className="border-b hover:bg-gray-50 transition">
                          <td className="p-3 font-medium">{app.userId?.name || app.name || "Không tên"}</td>
                          <td className="p-3 text-gray-700">{app.userId?.email || app.email}</td>
                          <td className="p-3 text-gray-700">{app.jobId?.title || "Không có dữ liệu"}</td>
                          <td className="p-3">
                            <span className={`text-sm px-3 py-1 rounded-full ${app.status === 'accepted' ? 'bg-green-100 text-green-700 border border-green-300' : app.status === 'rejected' ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-yellow-100 text-yellow-700 border border-yellow-300'}`}>{(app.status || '').toUpperCase()}</span>
                          </td>
                          <td className="p-3">
                            {(app.status === 'accepted' || app.status === 'rejected') ? (
                              <span className="italic text-gray-500">Đã xử lý</span>
                            ) : (
                              <div className="flex gap-2">
                                <button onClick={() => updateStatus(app._id, 'accepted')} className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"><CheckCircle size={16}/> Duyệt</button>
                                <button onClick={() => updateStatus(app._id, 'rejected')} className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1"><XCircle size={16}/> Từ chối</button>
                              </div>
                            )}
                          </td>
                          <td className="p-3">
                            {app.cvFile ? (
                              <button onClick={() => handleViewCV(app.cvFile, app.userId?.name || app.name)} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Xem CV</button>
                            ) : (
                              <span className="text-gray-400 italic">Không có CV</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Modal xem CV */}
              <Modal open={cvModal.open} onClose={() => { setCvModal({ ...cvModal, open: false }); setTranslationResult(""); setContextMenu({ show: false, x: 0, y: 0, selectedText: "" }); }} title={cvModal.title} width={700}>
                <div style={{ whiteSpace: "pre-wrap", maxHeight: 500, overflowY: "auto" }} onMouseUp={handleTextSelection} dangerouslySetInnerHTML={{ __html: cvModal.content }} />
                {translationResult && (<div dangerouslySetInnerHTML={{ __html: translationResult }} style={{ marginTop: "16px" }} />)}
              </Modal>

              {/* Context menu */}
              {contextMenu.show && (
                <div style={{ position: "fixed", top: contextMenu.y, left: contextMenu.x, transform: "translate(-50%, -100%)", zIndex: 9999, backgroundColor: "white", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", borderRadius: "8px", padding: "4px", display: "flex", gap: "4px" }} onClick={(e) => e.stopPropagation()}>
                  <button onClick={handleTranslate} disabled={translating} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium disabled:opacity-50">{translating ? "⏳" : "🌐"} Dịch</button>
                  <button onClick={handleSummarize} disabled={translating} className="px-3 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 text-sm font-medium disabled:opacity-50">{translating ? "⏳" : "✨"} Tóm tắt</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyPublicProfile;
