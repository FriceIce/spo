import axios from "axios";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";

const useFetchMe = () => {
  const [cookie] = useCookies(["access_token"]);
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!cookie.access_token || user) return;
    const token: string = cookie.access_token;
    const fetchMe = async () => {
      const response = await axios.get(`https://api.spotify.com/v1/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);
      dispatch({ type: "user/setUser", payload: response.data });
    };

    fetchMe();
  }, [cookie.access_token]);
};

export default useFetchMe;
