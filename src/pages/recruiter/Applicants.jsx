import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, User, Briefcase, Mail } from "lucide-react";
import Modal from "../../components/Modal";

export default function Applicants() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cvModal, setCvModal] = useState({ open: false, content: "", title: "" });
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, selectedText: "" });
  const [translating, setTranslating] = useState(false);
  const [translationResult, setTranslationResult] = useState("");
  const MAX_CV_LENGTH = 50000;
  const API = import.meta.env.VITE_API_URL;
  // Hàm xem CV
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

      // Nổi bật contactInfo
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

      // Hiển thị các section
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

      setCvModal({
        open: true,
        content,
        title: name || "CV Ứng viên"
      });
    } catch (err) {
      setCvModal({ open: true, content: "Không thể đọc CV: " + (err?.response?.data?.message || err.message), title: name || "CV Ứng viên" });
    }
  };

  // Xử lý chọn văn bản
  const handleTextSelection = (e) => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText.length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setContextMenu({
        show: true,
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
        selectedText: selectedText
      });
    } else {
      setContextMenu({ show: false, x: 0, y: 0, selectedText: "" });
    }
  };

  // Dịch văn bản
  const handleTranslate = async () => {
    if (!contextMenu.selectedText) return;
    
    try {
      setTranslating(true);
      const res = await axios.post(
        `${API}/api/llm/translate`,
        {
          text: contextMenu.selectedText,
          input_language: "English",
          output_language: "Vietnamese"
        },
        { headers: { "Content-Type": "application/json" } }
      );
      
      setTranslationResult(`<div style="background:#dbeafe;padding:12px;border-radius:8px;margin-top:10px;border-left:4px solid #3b82f6">
        <div style="font-weight:bold;color:#1e40af;margin-bottom:6px">📝 Bản dịch:</div>
        <div style="color:#1e3a8a">${res.data.translation || res.data.result || "Không có kết quả"}</div>
      </div>`);
      setContextMenu({ show: false, x: 0, y: 0, selectedText: "" });
    } catch (err) {
      alert("Lỗi khi dịch: " + (err?.response?.data?.message || err.message));
    } finally {
      setTranslating(false);
    }
  };

  // Tóm tắt văn bản
    const handleSummarize = async () => {
    if (!contextMenu.selectedText) return;
    
    try {
      setTranslating(true);
      const res = await axios.post(
        `${API}/api/llm/summarize`,
        {
          text: contextMenu.selectedText,
          language: "English" // hoặc auto-detect
        },
        { headers: { "Content-Type": "application/json" } }
      );
      
      // Hiển thị cả bản gốc và bản dịch
      let displayContent = `<div style="background:#fef3c7;padding:12px;border-radius:8px;margin-top:10px;border-left:4px solid #f59e0b">
        <div style="font-weight:bold;color:#92400e;margin-bottom:6px">✨ Tóm tắt (Tiếng Việt):</div>
        <div style="color:#78350f">${res.data.result || "Không có kết quả"}</div>`;
      
      // Nếu có bản tóm tắt gốc (khác tiếng Việt)
      if (res.data.original_summary && res.data.language !== "Vietnamese") {
        displayContent += `<div style="margin-top:10px;padding-top:10px;border-top:1px solid #fcd34d">
          <div style="font-weight:bold;color:#92400e;margin-bottom:6px">📄 Bản gốc (${res.data.language}):</div>
          <div style="color:#78350f;font-size:0.9em">${res.data.original_summary}</div>
        </div>`;
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

  const fetchApps = async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${API}/api/recruiter/applications`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("📦 recruiter applications:", res.data);

setApps(res.data.applications || []);
  } catch (err) {
    console.log("❌ Lỗi tải ứng viên:", err);
  } finally {
    setLoading(false);
  }
};
  const updateStatus = async (appId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API}/api/jobs/applications/${appId}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchApps();
    } catch (err) {
      console.log("Lỗi cập nhật trạng thái:", err);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  // Đóng context menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = () => {
      setContextMenu({ show: false, x: 0, y: 0, selectedText: "" });
    };
    
    if (contextMenu.show) {
      document.addEventListener("click", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu.show]);

  const statusBadge = {
    accepted: "bg-green-100 text-green-700 border border-green-300",
    rejected: "bg-red-100 text-red-700 border border-red-300",
    pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
    applied: "bg-gray-100 text-gray-700 border border-gray-300",
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">
          Ứng viên đã ứng tuyển
        </h1>

        {loading && <p className="text-gray-600">Đang tải dữ liệu...</p>}

        {!loading && apps.length === 0 && (
          <p className="text-gray-600">Chưa có ứng viên nào.</p>
        )}

        {!loading && apps.length > 0 && (
          <div className="overflow-x-auto shadow-xl rounded-xl bg-white p-5 border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                  <th className="p-4">Ứng viên</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Công việc</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4">Hành động</th>
                  <th className="p-4">CV</th>
                </tr>
              </thead>

              <tbody>
                {apps.map((app) => (
                  <tr
                    key={app._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium">
                      {app.userId?.name || app.name || "Không tên"}
                    </td>

                    <td className="p-4 text-gray-700">
                      {app.userId?.email || app.email}
                    </td>

                    <td className="p-4 text-gray-700">
                      {app.jobId?.title || "Không có dữ liệu"}
                    </td>

                    <td className="p-4">
                      <span
                        className={`text-sm px-3 py-1 rounded-full ${statusBadge[app.status]}`}
                      >
                        {app.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-4">
                      {app.status === "accepted" ||
                      app.status === "rejected" ? (
                        <span className="italic text-gray-500">Đã xử lý</span>
                      ) : (
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              updateStatus(app._id, "accepted")
                            }
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                          >
                            <CheckCircle size={16} /> Duyệt
                          </button>

                          <button
                            onClick={() =>
                              updateStatus(app._id, "rejected")
                            }
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1"
                          >
                            <XCircle size={16} /> Từ chối
                          </button>
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      {app.cvFile ? (
                        <button
                          onClick={() => handleViewCV(app.cvFile, app.userId?.name || app.name)}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                          Xem CV
                        </button>
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
        <Modal 
          open={cvModal.open} 
          onClose={() => {
            setCvModal({ ...cvModal, open: false });
            setTranslationResult("");
            setContextMenu({ show: false, x: 0, y: 0, selectedText: "" });
          }} 
          title={cvModal.title} 
          width={700}
        >
          <div 
            style={{ whiteSpace: "pre-wrap", maxHeight: 500, overflowY: "auto" }}
            onMouseUp={handleTextSelection}
            dangerouslySetInnerHTML={{ __html: cvModal.content }}
          />
          
          {/* Hiển thị kết quả dịch/tóm tắt */}
          {translationResult && (
            <div 
              dangerouslySetInnerHTML={{ __html: translationResult }}
              style={{ marginTop: "16px" }}
            />
          )}
        </Modal>

        {/* Context Menu cho Dịch và Tóm tắt */}
        {contextMenu.show && (
          <div
            style={{
              position: "fixed",
              top: contextMenu.y,
              left: contextMenu.x,
              transform: "translate(-50%, -100%)",
              zIndex: 9999,
              backgroundColor: "white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              borderRadius: "8px",
              padding: "4px",
              display: "flex",
              gap: "4px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleTranslate}
              disabled={translating}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
            >
              {translating ? "⏳" : "🌐"} Dịch
            </button>
            <button
              onClick={handleSummarize}
              disabled={translating}
              className="px-3 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 text-sm font-medium disabled:opacity-50"
            >
              {translating ? "⏳" : "✨"} Tóm tắt
            </button>
          </div>
        )}
      </div>
    </div>
  );
}