import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import AuthContext from "../../context/AuthProvider";
import axios from "../../API/axios";
export default function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setAuth } = useContext(AuthContext);

  const navigate = useNavigate();
  const userRef = useRef();

  // useEFFECT to focus on input
  useEffect(() => {
    userRef.current.focus();
  }, []);
  // to prevent page loading
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password);

    const data = {
      username: username,
      password: password,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
        withCredentials: true,
      },
    };
    try {
      axios
        .post("/login", JSON.stringify(data), config)
        .then((response) => {
          const accessToken = response.data.accessToken;
          // console.log("accessToken:" + response?.data?.accessToken);
          setAuth({ username, password, accessToken });
          navigate("/dashboard");
        })
        .catch((err) => {
          setErrorMessage(
            "Authentication failed. Please check your credentials."
          );
          console.error("axios error:", err);
        });
    } catch (error) {
      setErrorMessage("bad connexion to the serveur pls try again ! ");
      console.error("Login error:", error);
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
            ref={userRef}
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
