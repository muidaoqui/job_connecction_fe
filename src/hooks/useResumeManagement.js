import { useState, useEffect } from "react";
import { message } from "antd";
import {
    getProfile,
    uploadResume,
    getResumes,
    setMainResume as apiSetMainResume,
} from "../api/profileAPI";

/* =========================================================
   HELPERS
========================================================= */

// Chuẩn hoá path cho Windows / Linux
const normalizePath = (path) => (path ? path.replace(/\\/g, "/") : "");

// So sánh 2 file dựa trên filename (tránh lệch absolute/relative path)
const isSameFile = (a, b) => {
    if (!a || !b) return false;
    return normalizePath(a).split("/").pop() === normalizePath(b).split("/").pop();
};

/* =========================================================
   HOOK
========================================================= */

export const useResumeManagement = () => {
    const [resumes, setResumes] = useState([]);
    const [mainResume, setMainResumeState] = useState(null);
    const [loading, setLoading] = useState(false);

    /* =======================================================
       FETCH RESUMES
    ======================================================= */

    const fetchResumes = async () => {
        try {
            setLoading(true);

            // 1️⃣ Lấy profile để biết CV chính
            const profileRes = await getProfile();
            const profile = profileRes?.data;

            const mainResumePath =
                profile?.candidate?.mainResumePath ||
                profile?.mainResumePath ||
                null;

            // 2️⃣ Lấy danh sách CV (BE mới)
            const resList = await getResumes();
            const files = resList?.data || [];

            if (files.length > 0) {
                const mapped = files.map((f, idx) => {
                    const normalized = normalizePath(f.path || f.name || "");

                    return {
                        id: f.filename || f.id || `resume-${idx}`,
                        name: f.name || normalized.split("/").pop(),
                        path: normalized,
                        uploadedAt: f.uploadedAt || null,
                        isMain: mainResumePath
                            ? normalized === mainResumePath
                            : idx === 0,

                        percent: 100,
                    };
                });

                setResumes(mapped);

                const main = mapped.find((r) => r.isMain);
                setMainResumeState(main || mapped[0] || null);
                return;
            }

            // 3️⃣ Fallback BE cũ (chỉ có 1 resumePath)
            const legacyPath =
                profile?.candidate?.resumePath || profile?.resumePath || null;

            if (legacyPath) {
                const normalized = normalizePath(legacyPath);

                const resumeObj = {
                    id: "main",
                    name: normalized.split("/").pop(),
                    path: normalized,
                    uploadedAt: profile?.updatedAt || profile?.createdAt,
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
            console.error("❌ Lỗi khi tải danh sách CV:", error);
        } finally {
            setLoading(false);
        }
    };

    /* =======================================================
       INIT
    ======================================================= */

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) fetchResumes();
    }, []);

    /* =======================================================
       UPLOAD RESUME
    ======================================================= */

    const uploadNewResume = async (file) => {
        if (!file) return null;

        const formData = new FormData();
        formData.append("resume", file); // PHẢI khớp uploadCV.single("resume")

        try {
            setLoading(true);

            const response = await uploadResume(formData);
            message.success("CV được tải lên thành công");

            // Reload list
            await fetchResumes();

            return response?.data || null;
        } catch (error) {
            console.error("❌ Upload CV error:", error.response?.data || error.message);
            message.error(
                "Lỗi khi tải CV: " +
                (error.response?.data?.message || error.message)
            );
            return null;
        } finally {
            setLoading(false);
        }
    };

    /* =======================================================
       SET MAIN RESUME
    ======================================================= */

    const setMainResume = async (resumePath) => {
        if (!resumePath) return;

        try {
            setLoading(true);

            await apiSetMainResume(resumePath);
            message.success("Đã đặt CV chính");

            const updated = resumes.map((r) => ({
                ...r,
                isMain: r.path === resumePath,
            }));


            setResumes(updated);

            const main = updated.find((r) => r.isMain);
            setMainResumeState(main || null);
        } catch (error) {
            console.error("❌ Set main resume error:", error);
            message.error(
                "Lỗi lưu CV chính: " +
                (error.response?.data?.message || error.message)
            );
        } finally {
            setLoading(false);
        }
    };

    /* =======================================================
       EXPORT
    ======================================================= */

    return {
        resumes,
        mainResume,
        loading,
        fetchResumes,
        uploadNewResume,
        setMainResume,
    };
};
