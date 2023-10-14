import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import PhoneVerify from "./components/PhoneVerify";
import jwt from "jsonwebtoken";

export default function App() {
  // verify if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem("authToken");
    console.log(token);
    if (token) {
      const decodedToken = jwt.decode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken && decodedToken.exp > currentTime;
    }
    return false;
  };
  // verify if authentificated go to private routes otherwise go to login
  const PrivateRoute = () => {
    return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/login" element={<Login />}></Route>
        <Route path="/Signup" element={<Signup />}></Route>
        <Route path="phone/verify" element={<PhoneVerify />}></Route>
      </Routes>
    </BrowserRouter>
  );
}
