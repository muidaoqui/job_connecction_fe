import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Select, Button, Card, Empty, Spin, Pagination, Tabs } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const People = () => {
  const [recruiters, setRecruiters] = useState([]);
  const [filteredRecruiters, setFilteredRecruiters] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [industries, setIndustries] = useState([]);
  
  const [recruitersPagination, setRecruitersPagination] = useState({ page: 1, limit: 9, total: 0 });
  const [companiesPagination, setCompaniesPagination] = useState({ page: 1, limit: 9, total: 0 });
  const [followingMap, setFollowingMap] = useState({});
  const [activeTab, setActiveTab] = useState("recruiters");

  useEffect(() => {
    fetchRecruiters(1);
  }, []);

  useEffect(() => {
    fetchCompanies(1);
  }, []);

  const fetchRecruiters = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/recruiter?page=${page}&limit=9`);
      if (res.data?.recruiters) {
        setRecruiters(res.data.recruiters);
        setFilteredRecruiters(res.data.recruiters);

        setRecruitersPagination({
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

  const fetchCompanies = async (page = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/company?page=${page}&limit=9`);
      // Backend returns { success: true, data: [...], pagination: {...} }
      const companiesData = res.data?.data || res.data?.companies || [];
      if (companiesData.length > 0) {
        setCompanies(companiesData);
        setFilteredCompanies(companiesData);

        // Extract unique industries
        const uniqueIndustries = [...new Set(companiesData.map(c => c.industry).filter(Boolean))];
        setIndustries(uniqueIndustries);

        setCompaniesPagination({
          page: res.data.pagination?.page || page,
          limit: res.data.pagination?.limit || 9,
          total: res.data.pagination?.total || 0,
        });
      }
    } catch (err) {
      console.error("Lỗi khi lấy companies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchRecruiters = () => {
    let filtered = recruiters;

    if (searchTerm) {
      filtered = filtered.filter(recruiter =>
        recruiter.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recruiter.companyId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRecruiters(filtered.sort((a, b) => (b.followers || 0) - (a.followers || 0)));
  };

  const handleSearchCompanies = () => {
    let filtered = companies;

    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedIndustry) {
      filtered = filtered.filter(company => company.industry === selectedIndustry);
    }

    setFilteredCompanies(filtered);
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
      fetchRecruiters(recruitersPagination.page);
    } catch (err) {
      console.error("Lỗi khi follow recruiter:", err);
    }
  };

  const tabItems = [
    {
      key: "recruiters",
      label: "👥 Nhân Viên Tuyển Dụng",
      children: (
        <div>
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
                  onPressEnter={handleSearchRecruiters}
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSearchRecruiters}
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
                        onClick={() => window.location.href = `/customer/recruiter/${recruiter._id}`}
                      >
                        Xem Profile
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {recruitersPagination.total > recruitersPagination.limit && (
                <div className="flex justify-center">
                  <Pagination
                    current={recruitersPagination.page}
                    total={recruitersPagination.total}
                    pageSize={recruitersPagination.limit}
                    onChange={(page) => fetchRecruiters(page)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      ),
    },
    {
      key: "companies",
      label: "🏢 Công Ty",
      children: (
        <div>
          {/* Search Filters */}
          <Card className="mb-6 shadow-md">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Tên công ty</label>
                <Input
                  placeholder="Tìm kiếm công ty..."
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onPressEnter={handleSearchCompanies}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Ngành nghề</label>
                <Select
                  placeholder="Chọn ngành"
                  allowClear
                  value={selectedIndustry || undefined}
                  onChange={(val) => setSelectedIndustry(val || "")}
                  options={industries.map(ind => ({ label: ind, value: ind }))}
                />
              </div>

              <div />

              <div className="flex items-end">
                <Button
                  type="primary"
                  size="large"
                  onClick={handleSearchCompanies}
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
          ) : filteredCompanies.length === 0 ? (
            <Empty description="Không tìm thấy công ty phù hợp" />
          ) : (
            <>
              <div className="grid grid-cols-3 gap-6 mb-6">
                {filteredCompanies.map((company) => (
                  <Card key={company._id} className="hover:shadow-lg transition cursor-pointer">
                    <div className="flex flex-col items-center text-center h-full">
                      {company.logo && (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="h-20 object-contain mb-4"
                        />
                      )}

                      <h3 className="text-lg font-bold text-blue-600 mb-2">{company.name}</h3>

                      {company.industry && (
                        <p className="text-xs text-gray-600 mb-2">{company.industry}</p>
                      )}

                      <div className="text-xs text-gray-500 space-y-1 mb-3 flex-grow">
                        {company.country && <p>📍 {company.country}</p>}
                        {company.size && <p>👥 {company.size}</p>}
                      </div>

                      {company.description && (
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{company.description}</p>
                      )}

                      <div className="space-y-2 w-full">
                        <Button
                          type="primary"
                          block
                          size="small"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => window.location.href = `/customer/company/${company._id}`}
                        >
                          Xem Chi Tiết
                        </Button>

                        {/* website removed - use company detail page instead */}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {companiesPagination.total > companiesPagination.limit && (
                <div className="flex justify-center">
                  <Pagination
                    current={companiesPagination.page}
                    total={companiesPagination.total}
                    pageSize={companiesPagination.limit}
                    onChange={(page) => fetchCompanies(page)}
                  />
                </div>
              )}
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-6 py-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Khám Phá Nhân Viên & Công Ty</h1>
      
      <Tabs 
        items={tabItems} 
        activeKey={activeTab}
        onChange={setActiveTab}
        className="bg-white rounded-lg shadow-md p-4"
      />
    </div>
  );
};

export default People;
