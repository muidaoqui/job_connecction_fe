import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Button, Card, Empty, Spin, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const Recruiters = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [filteredRecruiters, setFilteredRecruiters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0 });
  const [followingMap, setFollowingMap] = useState({});

  useEffect(() => {
    fetchRecruiters(1);
  }, []);

  const fetchRecruiters = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/recruiter?page=${page}&limit=9`);
      if (res.data?.recruiters) {
        setRecruiters(res.data.recruiters);
        setFilteredRecruiters(res.data.recruiters);

        setPagination({
          page: res.data.pagination?.page || page,
          limit: res.data.pagination?.limit || 9,
          total: res.data.pagination?.total || 0,
        });
      }
    } catch (err) {
      console.error("Lỗi khi lấy recruiters:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    let filtered = recruiters;

    if (searchTerm) {
      filtered = filtered.filter(recruiter =>
        recruiter.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recruiter.companyId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRecruiters(filtered.sort((a, b) => (b.followers || 0) - (a.followers || 0)));
  };

  const handleFollow = async (recruiterId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      if (followingMap[recruiterId]) {
        // Unfollow
        await axios.post(
          `http://localhost:8080/api/recruiter/${recruiterId}/unfollow`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFollowingMap({ ...followingMap, [recruiterId]: false });
      } else {
        // Follow
        await axios.post(
          `http://localhost:8080/api/recruiter/${recruiterId}/follow`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFollowingMap({ ...followingMap, [recruiterId]: true });
      }

      // Refresh recruiters to get updated followers count
      fetchRecruiters(pagination.page);
    } catch (err) {
      console.error("Lỗi khi follow recruiter:", err);
    }
  };

  return (
    <div className="container mx-auto px-6 py-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Khám Phá Nhân Viên Tuyển Dụng</h1>

      {/* Search */}
      <Card className="mb-6 shadow-md">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-3">
            <label className="block text-sm font-semibold mb-2">Tìm kiếm</label>
            <Input
              placeholder="Tìm kiếm theo tên hoặc công ty..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onPressEnter={handleSearch}
            />
          </div>

          <div className="flex items-end">
            <Button
              type="primary"
              size="large"
              onClick={handleSearch}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Tìm Kiếm
            </Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      {loading ? (
        <Spin />
      ) : filteredRecruiters.length === 0 ? (
        <Empty description="Không tìm thấy nhân viên tuyển dụng" />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-6 mb-6">
            {filteredRecruiters.map((recruiter) => (
              <Card key={recruiter._id} className="hover:shadow-lg transition">
                <div className="flex flex-col items-center text-center h-full">
                  <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-3">
                    {recruiter.userId?.name?.charAt(0).toUpperCase() || 'R'}
                  </div>

                  <h3 className="text-lg font-bold text-blue-600 mb-1">
                    {recruiter.userId?.name || "Recruiter"}
                  </h3>

                  {recruiter.position && (
                    <p className="text-sm text-gray-600 mb-2">{recruiter.position}</p>
                  )}

                  {recruiter.companyId && (
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      {recruiter.companyId.name}
                    </p>
                  )}

                  <div className="text-xs text-gray-500 mb-4">
                    <p>👥 {recruiter.followers || 0} người theo dõi</p>
                  </div>

                  {recruiter.userId?.email && (
                    <p className="text-xs text-gray-500 mb-3 break-all">
                      {recruiter.userId.email}
                    </p>
                  )}

                  <Button
                    type={followingMap[recruiter._id] ? "default" : "primary"}
                    block
                    className={followingMap[recruiter._id] 
                      ? "" 
                      : "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                    }
                    onClick={() => handleFollow(recruiter._id)}
                  >
                    {followingMap[recruiter._id] ? "Đã Theo Dõi" : "Theo Dõi"}
                  </Button>

                  <Button
                    type="link"
                    block
                    className="text-blue-500 hover:text-blue-700 mt-2"
                    onClick={() => window.location.href = `/recruiter/${recruiter._id}`}
                  >
                    Xem Profile
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.total > pagination.limit && (
            <div className="flex justify-center">
              <Pagination
                current={pagination.page}
                total={pagination.total}
                pageSize={pagination.limit}
                onChange={(page) => fetchRecruiters(page)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Recruiters;
