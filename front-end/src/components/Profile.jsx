import React, { useEffect, useState } from "react";
import "../../public/css/personalProfile.css";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const PersonalInfo = () => {
  const axiosPrivate = useAxiosPrivate();
  const [errorMessage, setErrorMessage] = useState("");
  const [images, setImages] = useState([]);

  const navigate = useNavigate();
  const [user, setUser] = useState("");
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axiosPrivate.get("/profile");
        setUser(response.data);
        const imageBlob = await response.image.image.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        setImages([...images, imageUrl]);
      } catch (error) {
        setErrorMessage("Error fetching Personal:");
        console.error("Error fetching Personal:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="profile">
      <div className="profile-image">{/* image */}</div>
      <div className="profile-info">
        {user && (
          <>
            {images.map((imageUrl) =>
              image ? (
                <img src={imageUrl} alt={`Uploaded Image`} />
              ) : (
                <p>No image available</p>
              )
            )}
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
