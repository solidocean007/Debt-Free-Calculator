import React from "react";
import './minAlert.css';

const MinAlert = ({showAlert, closeAlert, message}) => {
  if(!showAlert) {
    return null;
  }

  return (
    <div className="alertZone">
      <div className="alert-content">
        <h3>{message}</h3>
        <button onClick={closeAlert}>Close</button>
      </div>
    </div>
  );
};

export default MinAlert;