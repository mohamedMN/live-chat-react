import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import AuthContext from "../../context/AuthProvider";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  // const { auth } = useContext(AuthContext);
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosPrivate.get("/users");
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
        <button
          style={{ backgroundColor: "#0000FF", color: "white" }}
          onClick={() => navigate("/Profile")}
        >
          GO To Profile
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
