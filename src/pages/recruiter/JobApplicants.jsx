import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function JobApplicants() {
  const { jobId } = useParams();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchApplicants = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/recruiter/applications/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApps(res.data.data || []);
    } catch (err) {
      console.error("Lỗi lấy ứng viên theo job", err);
      setApps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId) fetchApplicants();
  }, [jobId]);

  const updateStatus = async (applicationId, status) => {
    try {
      await axios.put(
        `http://localhost:8080/api/recruiter/applications/${applicationId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchApplicants();
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái", err);
    }
  };

  // ✅ BUILD TÊN ỨNG VIÊN – KHÔNG BAO GIỜ TRẮNG
  const getCandidateName = (user) => {
    if (!user) return "Ứng viên";

    if (user.fullName && user.fullName.trim() !== "") {
      return user.fullName;
    }

    const full = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    if (full) return full;

    if (user.name && user.name.trim() !== "") {
      return user.name;
    }

    if (user.email) {
      return user.email.split("@")[0];
    }

    return "Ứng viên";
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-8 text-center">
          Ứng viên đã ứng tuyển
        </h1>

        {loading && (
          <p className="text-center text-gray-500">Đang tải dữ liệu...</p>
        )}

        {!loading && apps.length === 0 && (
          <p className="text-center text-gray-500">
            Chưa có ứng viên nào cho job này.
          </p>
        )}

        {!loading && apps.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 text-left">Họ tên</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">CV</th>
                  <th className="p-4 text-left">Trạng thái</th>
                  <th className="p-4 text-left">Hành động</th>
                </tr>
              </thead>

              <tbody>
                {apps.map((app) => (
                  <tr key={app._id} className="border-t">
                    <td className="p-4 font-medium">
  {app.name || 
    app.userId?.fullName ||
    `${app.userId?.firstName || ""} ${app.userId?.lastName || ""}`.trim() ||
    app.userId?.name ||
    app.userId?.email?.split("@")[0]}
</td>

                    <td className="p-4">{app.userId?.email}</td>

                    <td className="p-4">
                      {app.cvFile ? (
                        <a
                          href={`http://localhost:8080/${app.cvFile}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          Xem CV
                        </a>
                      ) : (
                        <span className="text-gray-400">Không có CV</span>
                      )}
                    </td>

                    <td className="p-4 capitalize font-semibold">
                      {app.status === "pending" && (
                        <span className="text-yellow-600">Pending</span>
                      )}
                      {app.status === "accepted" && (
                        <span className="text-green-600">Accepted</span>
                      )}
                      {app.status === "rejected" && (
                        <span className="text-red-600">Rejected</span>
                      )}
                    </td>

                    <td className="p-4 space-x-2">
                      {app.status === "pending" ? (
                        <>
                          <button
                            onClick={() =>
                              updateStatus(app._id, "accepted")
                            }
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Accept
                          </button>

                          <button
                            onClick={() =>
                              updateStatus(app._id, "rejected")
                            }
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
