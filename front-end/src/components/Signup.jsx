import { useState } from "react";
import { useNavigate } from "react-router";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirm_password, setConfPass] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const info = {
    email,
    username,
    password,
    confirm_password,
  };
  const postSignUpDetails = async () => {
    try {
      const response = await fetch("http://localhost:3500/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      });
      if (response.ok) {
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
    console.log({ email, username, password, confirm_password });
  };
  const gotoLoginPage = () => {
    navigate("/");
  };
  return (
    // component form of sign in
    <div className="signup__container">
      <h2>Sign up </h2>
      <form className="signup__form" onSubmit={handleSubmit}>
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
