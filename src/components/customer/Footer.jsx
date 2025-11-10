import React from "react";
import logo from '../../assets/logo.png';
import { FaPhoneAlt, FaEnvelope, FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
function Footer() {
    return (
        <div className="bg-white border-t border-cyan-300 w-full">
            <div className="">
                <div className=" flex justify-around my-4 divide-y divide-cyan-300">
                    <h1 className="text-3xl text-blue-600 font-bold ml-10">HÃY LIÊN HỆ VỚI CHÚNG TÔI</h1>
                    <div className="flex gap-2">
                        <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow hover:bg-blue-600 transition">
                            <FaPhoneAlt size={20} />
                        </div>

                        <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow hover:bg-blue-600 transition">
                            <FaEnvelope size={20} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex w-full justify-between items-center p-4 shadow-md divide-x divide-cyan-300">
                <div className="w-1/4">
                    <img src={logo} alt="Logo" className="w-auto h-20 mx-auto" />
                </div>
                <div className="w-1/2 text-left flex flex-col gap-2 mx-8">
                    <p className="text-2xl font-bold text-cyan-400">JOB CONNECTION COMPANY</p>
                    <p>Tầng 12, 13, 14, Tòa nhà AP Tower, 518B Điện Biên Phủ, Phường Thạnh Mỹ Tây, Thành phố Hồ Chí Minh, Việt Nam</p>
                    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">

                        <div className="flex space-x-4 text-2xl mt-4 sm:mt-0">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-blue-500 transition-colors"
                            >
                                <FaFacebook />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-pink-500 transition-colors"
                            >
                                <FaInstagram />
                            </a>
                            <a
                                href="https://youtube.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-red-500 transition-colors"
                            >
                                <FaYoutube />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="w-1/4 text-right text-sm text-gray-600">
                    <p>Copyright © 2025.</p>
                    <p>All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}

export default Footer;
