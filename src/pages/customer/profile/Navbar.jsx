import React from "react";
import { Tabs } from "antd";
import { useNavigate, useLocation } from "react-router-dom"; 

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation(); 
    const pathKeyMap = {
        "/customer/mysaramin": "1",
        "/customer/jobmanagement": "2",
        "/customer/cvmanagement": "3",
        "/customer/emailmanagement": "4",
        "/customer/pertest": "5",
    };

    const getCurrentActiveKey = () => {
        const currentPath = location.pathname;
        
        return pathKeyMap[currentPath] || "1";
    };

    const items = [
        { key: "1", label: "My Saramin CV" },
        { key: "2", label: "Job management" },
        { key: "3", label: "CV Management" },
        { key: "4", label: "Email Management" },
        { key: "5", label: "Personality Test" },
    ];

    const handleTabChange = (key) => {
        const pathToNavigate = Object.keys(pathKeyMap).find(
            (path) => pathKeyMap[path] === key
        );
        
        if (pathToNavigate) {
            navigate(pathToNavigate);
        }
    };

    return (
        <div className="pt-8 my-4 mx-auto px-6 lg:px-8  border-gray-200 bg-white flex justify-center">
            <Tabs
                activeKey={getCurrentActiveKey()}
                items={items}
                onChange={handleTabChange}
                className="custom-saramin-tabs" 
            />
        </div>
    );
}