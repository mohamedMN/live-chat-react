import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "../../API/axios";
export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirm_password, setConfPass] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [image, setImage] = useState(null); // Store the selected image
  const postSignUpDetails = async () => {
    try {
      const formData = new FormData(); // Create a FormData object
      formData.append("email", email);
      formData.append("username", username);
      formData.append("password", password);
      formData.append("confirm_password", confirm_password);
      if (image) {
        formData.append("image", image); // Append the image file to the FormData
      }
      const response = await axios.post("/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Use multipart form data
        },
      });
      if (response.status === 201) {
        navigate("/login");
      } else {
        setErrorMessage("Registration failed. Please check your data.");
      }
    } catch (error) {
      setErrorMessage("Registration failed. Please try again later.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postSignUpDetails();
  };

  const gotoLoginPage = () => {
    navigate("/");
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setImage(selectedFile);
  };
  return (
    // component form of sign in
    <div className="signup__container">
      <h2>Sign up </h2>
      <form
        className="signup__form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <label htmlFor="email">Email Address</label>
        <input
          type="text"
          id="email"
          defaultValue={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="Username">Username</label>
        <input
          type="text"
          name="username"
          id="username"
          defaultValue={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="Password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="Password">Confirm Password</label>
        <input
          type="password"
          name="password"
          id=""
          required
          onChange={(e) => setConfPass(e.target.value)}
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
        />
        <button className="signupBtn" type="submit">
          SIGN UP
        </button>
        <p>
          Already have an account?{" "}
          <span className="link" onClick={gotoLoginPage}>
            Go to Login
          </span>
        </p>
      </form>
    </div>
  );
}
