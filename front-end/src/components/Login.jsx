import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import AuthContext from "../../context/AuthProvider";
import { axiosPrivate } from "../../API/axios";
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(username, password);

    const data = {
      username: username,
      password: password,
    };
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await axiosPrivate.post("/login", data, config);

      if (response.status >= 200 && response.status <= 400) {
        const accessToken = response.data.accessToken;
        setAuth({ username, password, accessToken });
        navigate("/dashboard");
      } else {
        setErrorMessage(
          "Authentication failed. Please check your credentials."
        );
      }
    } catch (error) {
      setErrorMessage("Bad connection to the server. Please try again!");
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
            name="password"
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
