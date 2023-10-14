import { useState } from "react";
import { useNavigate } from "react-router";

export default function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username, password);
    try {
      console.log("aaaaaa");
      const response = await fetch("http://localhost:3500/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      if (response.status === 200) {
        const data = await response.json();
        const token = data.token;
        localStorage.setItem("authToken", token);
        navigate("/dashboard");
      } else {
        setErrorMessage(
          "Authentication failed. Please check your credentials."
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("bad connexion to the serveur pls try again ! ");
    }
  };
  const gotoSignUpPage = () => {
    navigate("/Signup");
  };
  return (
    <>
      <div className="login__container">
        <h2>LOGIN</h2>
        <form className="login__form" onSubmit={handleSubmit}>
          <label htmlFor="username">User Name</label>
          <input
            type="text"
            id="email"
            name="username"
            value={username}
            required
            onChange={(e) => setUserName(e.target.value)}
          />
          <label htmlFor="password">Password</label>
          <input
            type="Password"
            id="Password"
            name="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <button className="loginBtn" type="submit">
            SIGN IN
          </button>

          <p>
            Dont have an account?{" "}
            <span className="link" onClick={gotoSignUpPage}>
              Sign up
            </span>
          </p>
        </form>
      </div>
    </>
  );
}
