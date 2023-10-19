import React, { useEffect, useState } from "react";
import "../../public/css/personalProfile.css";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const PersonalInfo = () => {
  const axiosPrivate = useAxiosPrivate();
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const [user, setuser] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get("/profile");
        setuser(response.data);
      } catch (error) {
        setErrorMessage("Error fetching Personal:");
        console.error("Error fetching Personal:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="profile">
      <div className="profile-image">{/* image */}</div>
      <div className="profile-info">
        {user && (
          <>
            <h2 className="username">{user.username}</h2>
            <p className="email">{user.email}</p>
          </>
        )}
      </div>
      <button className="signOutBtn" onClick={() => navigate("/dashboard")}>
        GO To Dashboard
      </button>
      <span>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </span>
    </div>
  );
};

export default PersonalInfo;
