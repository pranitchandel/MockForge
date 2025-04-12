import React from "react";
import {
  FaTimes,
  FaSave,
  FaTrash,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import "./index.css";

const Modal = ({
  isOpen,
  title,
  children,
  onConfirm,
  onClose,
  confirmText = "Save",
  isDelete = false,
  isNotification = false,
  notificationType = "", // 'success' | 'error'
  notificationMessage = "",
  errorMessage = "",
}) => {
  if (!isOpen) return null;

  const renderIcon = () => {
    if (notificationType === "success") return <FaCheckCircle />;
    if (notificationType === "error") return <FaExclamationTriangle />;
    return null;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>

        <div className="modal-body">
          {isNotification ? (
            <p className={`notification-message ${notificationType}`}>
              {renderIcon()} {notificationMessage}
            </p>
          ) : (
            children
          )}
        </div>

        {errorMessage && !isNotification && (
          <p className="error-message">{errorMessage}</p>
        )}

        <div className="modal-buttons">
          {isNotification ? (
            <button className="ok-btn" onClick={onClose}>
              OK
            </button>
          ) : (
            <>
              {onConfirm && (
                <button
                  className={isDelete ? "delete-btn" : "save-btn"}
                  onClick={onConfirm}
                >
                  {isDelete ? <FaTrash /> : <FaSave />} {confirmText}
                </button>
              )}
              <button className="cancel-btn" onClick={onClose}>
                <FaTimes /> Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
