import React, { useEffect, useState } from "react";
import {
    Card,
    Menu,
    Progress,
    Tag,
    Button,
    Switch,
    message,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import {
    getProfile,
    getExperiences,
    getSkills,
    getEducations,
} from "../../api/profileAPI";

const ProfileSidebar = ({ userName = "Múi Đào" }) => {
    const [profileData, setProfileData] = useState(null);
    const [completionPercent, setCompletionPercent] = useState(0);
    const [missingItems, setMissingItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setLoading(false);
                    return;
                }

                const [profileRes, expRes, skillRes, eduRes] = await Promise.all([
                    getProfile(),
                    getExperiences(),
                    getSkills(),
                    getEducations(),
                ]);

                const profile = profileRes.data;
                const experiences = expRes.data || [];
                const skills = skillRes.data || [];
                const educations = eduRes.data || [];

                setProfileData(profile);

                // Tính toán phần trăm hoàn thành
                let percent = 0;
                const missing = [];

                // Kiểm tra từng phần
                if (profile?.name) {
                    percent += 20;
                } else {
                    missing.push({ key: "1", text: "Họ và tên" });
                }

                if (profile?.candidate?.address) {
                    percent += 10;
                } else {
                    missing.push({ key: "2", text: "Tỉnh/Thành phố" });
                }

                if (skills.length > 0) {
                    percent += 20;
                } else {
                    missing.push({ key: "3", text: "Kỹ năng chuyên môn" });
                }

                if (experiences.length > 0) {
                    percent += 20;
                } else {
                    missing.push({ key: "4", text: "Kinh nghiệm làm việc" });
                }

                if (educations.length > 0) {
                    percent += 15;
                } else {
                    missing.push({ key: "5", text: "Học vấn" });
                }

                if (profile?.candidate?.dateOfBirth) {
                    percent += 5;
                } else {
                    missing.push({ key: "6", text: "Ngày sinh" });
                }

                if (profile?.candidate?.gender) {
                    percent += 5;
                } else {
                    missing.push({ key: "7", text: "Giới tính" });
                }

                if (profile?.candidate?.profileSummary) {
                    percent += 5;
                } else {
                    missing.push({ key: "8", text: "Tóm tắt hồ sơ" });
                }

                setCompletionPercent(Math.min(percent, 100));
                setMissingItems(missing);
            } catch (err) {
                console.error(err);
                message.error("Lỗi khi tải dữ liệu hồ sơ");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    return (
        <Card styles={{ body: { padding: "16px 20px" } }}>
            <div className="text-center mb-5">
                <Progress type="circle" percent={completionPercent} size={80} />
                <h3 className="mt-2">{profileData?.name || userName}</h3>
                <p className="text-gray-500">{completionPercent}%</p>
            </div>

            <p>
                Ứng tuyển nhanh hơn với Saramin CV bằng cách hoàn thành{" "}
                <strong>Thông tin chung</strong>.
            </p>

            {missingItems.length > 0 && (
                <>
                    <p className="text-red-600 font-bold">
                        Bạn đang thiếu các thông tin sau:
                    </p>
                    <Menu
                        mode="inline"
                        selectable={false}
                        className="border-r-0"
                        items={missingItems.map((item) => ({
                            key: item.key,
                            label: (
                                <>
                                    {item.text}{" "}
                                    <Tag color="blue">
                                        +{100 - completionPercent > 15 ? 15 : 100 - completionPercent}%
                                    </Tag>
                                </>
                            ),
                        }))}
                    />
                </>
            )}

            {missingItems.length === 0 && (
                <div className="text-center py-4">
                    <CheckCircleOutlined className="text-green-500 text-2xl mb-2" />
                    <p className="text-green-600 font-semibold">Hồ sơ hoàn thành!</p>
                </div>
            )}

            <hr className="my-5" />

            <div className="flex items-center justify-between mt-5 mb-5 p-3 border border-gray-200 rounded-lg">
                <div>
                    <h4 className="font-medium text-sm">Sẵn sàng làm việc</h4>
                    <p className="text-xs text-gray-600">
                        Kích hoạt chế độ Sẵn sàng làm việc để kết nối với nhà tuyển dụng.
                    </p>
                </div>
                <Switch defaultChecked={false} />
            </div>

            <Button type="primary" className="w-full">
                <CheckCircleOutlined /> Ứng tuyển ngay và nhận voucher &rarr;
            </Button>
        </Card>
    );
};

export default ProfileSidebar;
