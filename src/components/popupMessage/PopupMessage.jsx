// src/components/PopupMessage.jsx
import React from "react";
import "./PopupMessage.css";

const PopupMessage = ({ type = "success", message, onClose }) => {
  if (!message) return null;

  return (
    <div className={`popup ${type}`}>
      <span>{message}</span>
      <button className="close-btn" onClick={onClose}>×</button>
    </div>
  );
};

export default PopupMessage;
