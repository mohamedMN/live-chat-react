import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../API/axios";
import AuthContext from "../../context/AuthProvider";
import useRefreshToken from "../../hooks/useRefreshToken";
const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const refresh = useRefreshToken();
  useEffect(() => {
    const config = {
      // headers: { "Content-Type": "application/json" },
      withCredentials: true,
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    };
    const fetchData = async () => {
      try {
        const response = await axios.get("/users", config);
        setUsers(response.data);
      } catch (error) {
        setErrorMessage("Error fetching users:");
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <>
      <div className="dashboard">
        <h2 style={{ marginBottom: "30px" }}>HELLO NISWITH</h2>
        <button className="signOutBtn" onClick={handleSignOut}>
          SIGN OUT
        </button>
        <button onClick={() => refresh()}>Refresh</button>
        <br />
        <span>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </span>

        <h1>User Table</h1>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Dashboard;
