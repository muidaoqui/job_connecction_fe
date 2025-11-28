import React, { useEffect, useState } from "react";
import axios from "axios";
import { Input, Select, Button, Card, Empty, Spin, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [industries, setIndustries] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0 });

  useEffect(() => {
    fetchCompanies(1);
  }, []);

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

        setPagination({
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

  const handleSearch = () => {
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

  return (
    <div className="container mx-auto px-6 py-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Khám Phá Công Ty</h1>

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
              onPressEnter={handleSearch}
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
      ) : filteredCompanies.length === 0 ? (
        <Empty description="Không tìm thấy công ty phù hợp" />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-6 my-6">
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
                  </div>
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
