import { axiosPrivate } from "../API/axios";
import AuthContext from "../context/AuthProvider";
import { useContext } from "react";
export default function useRefreshToken() {
  const { auth, setAuth } = useContext(AuthContext);
  const refresh = async () => {
    const data = {
      password: auth.password,
      username: auth.username,
    };

    const response = await axiosPrivate.post("/refresh", JSON.stringify(data));
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
