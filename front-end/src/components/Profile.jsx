import React from "react";
import "../../public/css/personalProfile.css";
import { useNavigate } from "react-router-dom";

const PersonalInfo = () => {
  const navigate = useNavigate();

  return (
    <section id="personal-info" className="center">
      <h2>Personal Information</h2>
      <div className="info-container">
        <div className="info-item">
          <h3>Name</h3>
          <p>Your Name</p>
        </div>
        <div className="info-item">
          <h3>Email</h3>
          <p>yourname@example.com</p>
        </div>
        <div className="info-item">
          <h3>Location</h3>
          <p>Your City, Country</p>
        </div>
        <button className="signOutBtn" onClick={() => navigate("/dashboard")}>
          GO To Dashboard
        </button>
      </div>
    </section>
  );
};

export default PersonalInfo;
