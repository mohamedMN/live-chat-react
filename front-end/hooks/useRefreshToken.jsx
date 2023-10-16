import axios from "../API/axios";
import AuthContext from "../context/AuthProvider";
import { useContext } from "react";
export default function useRefreshToken() {
  const { auth, setAuth } = useContext(AuthContext);
  const refresh = async () => {
    const data = {
      password: auth.password,
      username: auth.username,
    };
    const config = {
      headers: {
        "Content-Type": "application/json",
        withCredentials: true,
        Authorization: `Bearer ${auth.accessToken}`,
      },
    };
    const response = await axios.post("/refresh", JSON.stringify(data), config);
    setAuth((prev) => {
      console.log(JSON.stringify(prev));
      console.log("Refresh Token :  " + response.data.accessToken);
      return {
        ...prev,
        accessToken: response.data.accessToken,
      };
    });
    return response.data.accessToken;
  };
  return refresh;
}
