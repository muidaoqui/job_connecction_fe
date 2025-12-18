import React from "react";

const Modal = ({ open, onClose, title, children, width = 500 }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay with blur + smooth transition */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out opacity-100"
        onClick={onClose}
      />

      {/* Modal content with smooth scale/opacity animation */}
      <div
        className="relative bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ease-in-out transform animate-modal"
        style={{ width: width, maxWidth: "90vw" }}
      >
        {/* Title */}
        {title && (
          <div className="mb-4 text-xl font-bold text-gray-800">{title}</div>
        )}

        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl transition-colors duration-200"
          onClick={onClose}
          aria-label="Đóng"
        >
          &times;
        </button>

        {/* Children (modal body) */}
        <div>{children}</div>
      </div>

      {/* Tailwind custom animation */}
      <style>
        {`
          .animate-modal {
            animation: modalShow 0.3s cubic-bezier(0.4,0,0.2,1);
          }
          @keyframes modalShow {
            0% {
              opacity: 0;
              transform: scale(0.95) translateY(20px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Modal;