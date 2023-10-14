import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const token = await localStorage.getItem("authToken");
      if (token) {
        try {
          const response = await axios.get("http://localhost:3500/users", {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          setUsers(response.data);
        } catch (error) {
          setErrorMessage("Error fetching users:");
          console.error("Error fetching users:", error);
        }
      } else {
        setErrorMessage("Token not found in localStorage.");
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
