import { useState, useEffect } from "react";
import { message } from "antd";
import { getProfile, uploadResume, getResumes, setMainResume as apiSetMainResume } from "../api/profileAPI";

export const useResumeManagement = () => {
    const [resumes, setResumes] = useState([]);
    const [mainResume, setMainResumeState] = useState(null); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            setLoading(true);

            // Fetch profile to get mainResumePath
            const profileRes = await getProfile();
            const profile = profileRes.data;
            const mainResumePath = profile?.candidate?.mainResumePath || profile?.mainResumePath || null;

            const resList = await getResumes();
            const files = resList.data || [];

            if (files.length > 0) {
                const mapped = files.map((f, idx) => {
                    const normalized = (f.path || f.name || "").replace(/\\/g, "/");

                    return {
                        id: f.filename || `r-${idx}`,
                        name: f.name || normalized.split("/").pop(),
                        path: normalized,
                        uploadedAt: null,
                        // Mark as main if path matches saved mainResumePath, or first if none saved
                        isMain: mainResumePath ? normalized === mainResumePath : idx === 0,
                        percent: 100,
                    };
                });

                setResumes(mapped);
                const main = mapped.find((r) => r.isMain);
                setMainResumeState(main || mapped[0] || null);
                return;
            }

            const resumePath =
                profile?.resumePath || profile?.candidate?.resumePath || null;

            if (resumePath) {
                const normalized = resumePath.replace(/\\/g, "/");
                const filename = normalized.split("/").pop();

                const resumeObj = {
                    id: "main",
                    name: filename,
                    path: normalized,
                    uploadedAt: profile.updatedAt || profile.createdAt,
                    isMain: true,
                    percent: 100,
                };

                setResumes([resumeObj]);
                setMainResumeState(resumeObj);
            } else {
                setResumes([]);
                setMainResumeState(null);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách CV:", error);
        } finally {
            setLoading(false);
        }
    };

    const uploadNewResume = async (file) => {
        if (!file) return null;

        const formData = new FormData();
        formData.append("resume", file);

        try {
            setLoading(true);

            const response = await uploadResume(formData);
            message.success("CV được tải lên thành công");

            await fetchResumes();
            return response.data;
        } catch (error) {
            console.error("Upload error:", error.response?.data || error.message);
            message.error(
                "Lỗi khi tải CV: " +
                (error.response?.data?.message || error.message)
            );
            return null;
        } finally {
            setLoading(false);
        }
    };

    const setMainResumeAPI = async (resumePath) => {
        if (!resumePath) return;
        try {
            setLoading(true);

            await apiSetMainResume(resumePath);
            message.success("Đã lưu CV chính");

            const updated = resumes.map((r) => ({
                ...r,
                isMain: r.path === resumePath,
            }));

            setResumes(updated);

            const newMain = updated.find((r) => r.isMain);
            setMainResumeState(newMain || null);

        } catch (error) {
            console.error("Error setting main resume:", error);
            message.error(
                "Lỗi lưu CV chính: " +
                (error.response?.data?.message || error.message)
            );
        } finally {
            setLoading(false);
        }
    };

    return {
        resumes,
        mainResume,
        loading,
        uploadNewResume,
        fetchResumes,
        setMainResume: setMainResumeAPI,
    };
};
