import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Select, Button, Card, Empty, Spin, Pagination, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [followingCompanies, setFollowingCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [industries, setIndustries] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0 });

  const API = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCompanies(1);
    if (token) fetchFollowingCompanies();
  }, []);

  /* ================= FETCH ================= */

  const fetchCompanies = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/company?page=${page}&limit=9`);
      const data = res.data?.data || [];

      setCompanies(data);
      setFilteredCompanies(data);
      setIndustries([...new Set(data.map(c => c.industry).filter(Boolean))]);
      setPagination(res.data.pagination || { page, limit: 9, total: data.length });
    } catch (err) {
      console.error("Lỗi khi lấy companies:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowingCompanies = async () => {
    try {
      const res = await axios.get(`${API}/api/company/following`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ids = res.data.data.map(item => item.companyId._id);
      setFollowingCompanies(ids);
    } catch (error) {
      console.error("Fetch following companies error", error);
    }
  };

  /* ================= ACTION ================= */

  const handleFollow = async (companyId, isFollowing, e) => {
    e.stopPropagation();

    if (!token) {
      message.warning("Vui lòng đăng nhập để theo dõi công ty");
      return;
    }

    try {
      if (isFollowing) {
        await axios.post(
          `${API}/api/company/${companyId}/unfollow`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success("Đã bỏ theo dõi công ty");
      } else {
        await axios.post(
          `${API}/api/company/${companyId}/follow`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        message.success("Đã theo dõi công ty");
      }

      fetchFollowingCompanies();
    } catch (error) {
      console.error("Follow error:", error);
      message.error("Thao tác thất bại");
    }
  };

  /* ================= SEARCH ================= */

  const handleSearch = () => {
    let result = companies;

    if (searchTerm) {
      result = result.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedIndustry) {
      result = result.filter(c => c.industry === selectedIndustry);
    }

    setFilteredCompanies(result);
  };

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-10 py-8">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-2">🏢 Khám phá công ty</h1>
      <p className="text-gray-600 mb-8">
        Tìm hiểu các nhà tuyển dụng hàng đầu đang tuyển dụng
      </p>

      {/* Filters */}
      <Card className="mb-8 shadow-sm rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Tìm theo tên hoặc mô tả công ty"
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={handleSearch}
            size="large"
          />

          <Select
            placeholder="Ngành nghề"
            allowClear
            size="large"
            value={selectedIndustry || undefined}
            onChange={(val) => setSelectedIndustry(val || "")}
            options={industries.map(ind => ({ label: ind, value: ind }))}
          />

          <div />

          <Button
            type="primary"
            size="large"
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Tìm công ty
          </Button>
        </div>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : filteredCompanies.length === 0 ? (
        <Empty description="Không tìm thấy công ty phù hợp" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredCompanies.map(company => {
              const isFollowing = followingCompanies.includes(company._id);

              return (
                <Card
                  key={company._id}
                  className="rounded-xl hover:shadow-xl transition cursor-pointer"
                  onClick={() => (window.location.href = `/company/${company._id}`)}
                >
                  <div className="flex flex-col items-center text-center h-full">
                    {company.logo && (
                      <img
                        src={company.logo}
                        alt={company.name}
                        className="h-20 mb-4 object-contain"
                      />
                    )}

                    <h3 className="text-lg font-bold text-blue-600 mb-1">
                      {company.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">{company.industry}</p>

                    <div className="flex gap-4 text-xs text-gray-600 mb-3">
                      {company.country && <span>📍 {company.country}</span>}
                      {company.size && <span>👥 {company.size}</span>}
                    </div>

                    <div className="flex gap-2 mt-auto w-full">
                      <Button
                        type="primary"
                        className="bg-blue-600 hover:bg-blue-700"
                        block
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/company/${company._id}`;
                        }}
                      >
                        Xem chi tiết
                      </Button>

                      <Button
                        danger={isFollowing}
                        type={isFollowing ? "default" : "primary"}
                        block
                        onClick={(e) =>
                          handleFollow(company._id, isFollowing, e)
                        }
                      >
                        {isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {pagination.total > pagination.limit && (
            <div className="flex justify-center mt-10">
              <Pagination
                current={pagination.page}
                total={pagination.total}
                pageSize={pagination.limit}
                onChange={(page) => fetchCompanies(page)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Companies;
