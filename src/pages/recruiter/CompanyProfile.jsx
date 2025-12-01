import React, { useState } from "react";
import axios from "../../services/axiosInstance";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

const fetchCompany = async () => {
  try {
    const res = await axios.get("/company/profile", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (res.data.success && res.data.data) {
      const c = res.data.data;

      setCompany({
        name: c.name,
        tagline: c.tagline,
        country: c.country,
        industry: c.industry,
        techStack: c.techs.join(", "),
        size: c.size,
        website: c.website,
        socialLinks: c.socialLinks.length
          ? c.socialLinks
          : [""],
      });

      setDescription(c.description);

      if (c.logo) setLogoPreview(c.logo);
    }
  } catch (err) {
    console.log("Không tìm thấy company, user chưa tạo company.");
  }
};
export default function CompanyProfile() {
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [description, setDescription] = useState("");

  const [company, setCompany] = useState({
    name: "",
    tagline: "",
    country: "Việt Nam",          // đổi từ nationality → country
    industry: "Công nghệ thông tin",
    techStack: "",               // lát chuyển sang techs[]
    size: "1-10",
    website: "",
    socialLinks: [""],
  });

  const [businessLicense, setBusinessLicense] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  React.useEffect(() => {
  fetchCompany();
}, []);


  // ===============================
  // HANDLE CHANGE
  // ===============================
  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleAddLink = () => {
    setCompany({ ...company, socialLinks: [...company.socialLinks, ""] });
  };

  const handleChangeLink = (i, value) => {
    const updated = [...company.socialLinks];
    updated[i] = value;
    setCompany({ ...company, socialLinks: updated });
  };

  // ===============================
  // FILE HANDLERS
  // ===============================
  const handleBusinessLicense = (e) => {
    const file = e.target.files[0];
    if (file) setBusinessLicense(file);
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files[0];
    if (file) setCoverImage(file);
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    setGalleryImages([...galleryImages, ...files]);
  };

  const removeGalleryImg = (index) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  // ===============================
  // SUBMIT
  // ===============================
 const handleSubmit = async () => {
  try {
    const formData = new FormData();

    // TEXT FIELDS
    formData.append("name", company.name);
    formData.append("tagline", company.tagline);
    formData.append("country", company.country);
    formData.append("industry", company.industry);
    formData.append("size", company.size);
    formData.append("website", company.website);
    formData.append("description", description);

    // techStack → techs[]
    const techArray = company.techStack
      .split(",")
      .map((item) => item.trim());
    formData.append("techs", JSON.stringify(techArray));

    // socialLinks[]
    formData.append("socialLinks", JSON.stringify(company.socialLinks));

    // FILES
    if (logoFile) formData.append("logo", logoFile);
    if (coverImage) formData.append("coverImage", coverImage);
    if (businessLicense) formData.append("businessLicense", businessLicense);

    galleryImages.forEach((img) => {
      formData.append("galleryImages", img);
    });

    // CALL API
    const res = await axios.post(
      "/company/profile",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (res.data.success) {
      alert("Lưu thành công!");

      // QUAN TRỌNG: Lưu company để CreateJob dùng companyId
      localStorage.setItem("company", JSON.stringify(res.data.data));
    } else {
      alert("Lưu thất bại: " + res.data.message);
    }

  } catch (error) {
    console.error(error);
    alert(
      "Lỗi khi lưu: " + (error.response?.data?.message || "Unknown error")
    );
  }
};


  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-xl font-semibold mb-6 text-gray-700 bg-blue-50 p-3 rounded-md">
        Lưu ý: Bạn cần điền thông tin (*) để lưu
      </h1>

      {/* LOGO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="col-span-1">
          <label
            htmlFor="logoUpload"
            className="w-64 h-64 bg-gray-100 border rounded-lg flex flex-col items-center justify-center cursor-pointer"
          >
            {logoPreview ? (
              <img src={logoPreview} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <img
                src="https://cdn-icons-png.flaticon.com/512/1829/1829523.png"
                className="w-20 opacity-50"
              />
            )}
          </label>

          <input
            id="logoUpload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleLogoChange}
          />

          <p className="text-center mt-2 text-gray-600">
            {logoPreview ? "Đã chọn logo" : "Chưa chọn logo"}
          </p>
        </div>

        {/* FORM */}
        <div className="col-span-2 grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="font-semibold">Tên công ty *</label>
            <input
              name="name"
              value={company.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div className="col-span-2">
            <label className="font-semibold">Tagline *</label>
            <input
              name="tagline"
              value={company.tagline}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div>
            <label className="font-semibold">Quốc tịch *</label>
            <select
              name="country"
              value={company.country}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            >
              <option>Việt Nam</option>
              <option>Mỹ</option>
              <option>Nhật Bản</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">Ngành nghề *</label>
            <select
              name="industry"
              value={company.industry}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            >
              <option>Công nghệ thông tin</option>
              <option>Giáo dục</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">Công nghệ *</label>
            <input
              name="techStack"
              value={company.techStack}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
              placeholder="React, Node, MySQL..."
            />
          </div>

          <div>
            <label className="font-semibold">Quy mô *</label>
            <select
              name="size"
              value={company.size}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            >
              <option>1-10</option>
              <option>10-50</option>
              <option>50-100</option>
              <option>100-500</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="font-semibold">Website</label>
            <input
              name="website"
              value={company.website}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 mt-1"
            />
          </div>

          <div className="col-span-2">
            <label className="font-semibold">Mạng xã hội</label>

            {company.socialLinks.map((link, i) => (
              <input
                key={i}
                value={link}
                onChange={(e) => handleChangeLink(i, e.target.value)}
                className="w-full border rounded-lg px-3 py-2 mt-2"
                placeholder="Link mạng xã hội"
              />
            ))}

            <button
              onClick={handleAddLink}
              className="text-blue-600 mt-3 hover:underline"
            >
              + Thêm đường dẫn
            </button>
          </div>
        </div>
      </div>


      {/* BUSINESS LICENSE */}
      <div className="mt-14">
        <p className="font-semibold text-lg">Giấy phép ĐK Kinh doanh *</p>
        <p className="text-gray-500 text-sm mb-3">Hỗ trợ PDF &lt; 5MB</p>

        <label className="w-full h-40 border-2 border-dashed border-blue-400 bg-blue-50 rounded-lg flex flex-col justify-center items-center cursor-pointer">
          <span className="text-4xl text-blue-500">⬆</span>
          <span className="font-medium text-blue-700">Kéo thả file</span>
          <span className="text-blue-600 underline text-sm">hoặc chọn file</span>

          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleBusinessLicense}
          />
        </label>

        {businessLicense && (
          <p className="text-green-600 mt-2 text-sm">
            Đã chọn: {businessLicense.name}
          </p>
        )}
      </div>

      {/* COVER + GALLERY */}
      <div className="mt-14">
        <p className="font-bold text-xl">Hình ảnh công ty</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6">
          <div>
            <label className="font-semibold">Ảnh bìa *</label>
            <label className="block w-full border rounded-xl h-56 flex flex-col justify-center items-center cursor-pointer bg-gray-50 mt-3">
              {coverImage ? (
                <img
                  src={URL.createObjectURL(coverImage)}
                  className="object-cover w-full h-full rounded-xl"
                />
              ) : (
                <span className="text-6xl text-gray-400">🖼️</span>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverUpload}
              />
            </label>
          </div>

          <div>
            <label className="font-semibold">Thư viện ảnh</label>
            <label className="block w-full border-2 border-dashed rounded-xl h-56 flex flex-col justify-center items-center cursor-pointer bg-gray-50 mt-3">
              <span className="text-6xl text-gray-400">📸</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleGalleryUpload}
              />
            </label>

            <div className="grid grid-cols-3 gap-3 mt-4">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="relative w-full h-24 border rounded-lg overflow-hidden">
                  <img
                    src={URL.createObjectURL(img)}
                    className="object-cover w-full h-full"
                  />
                  <button
                    onClick={() => removeGalleryImg(idx)}
                    className="absolute top-1 right-1 px-2 py-1 bg-red-600 text-white rounded text-xs"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="mt-14">
        <label className="font-semibold">Đãi ngộ / Thông tin công ty *</label>
        <ReactQuill
          value={description}
          onChange={setDescription}
          className="mt-2 bg-white"
          style={{ height: "250px" }}
        />
      </div>

      {/* SUBMIT */}
      <button
        onClick={handleSubmit}
        className="mt-12 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700"
      >
        Lưu & Xem trang công ty
      </button>
    </div>
  );
}
