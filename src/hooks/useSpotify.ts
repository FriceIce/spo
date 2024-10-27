import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import SpotifyWebApi from "spotify-web-api-js";
import { getRefreshToken } from "../modules/getRefreshToken";
import { RootState } from "../redux/store";

const useSpotify = () => {
  const [cookie, setCookies] = useCookies([
    "access_token",
    "refresh_token",
    "access_token_guest",
  ]);
  const currentUser = useSelector((state: RootState) => state.user.user);
  const spotifyApi = new SpotifyWebApi();

  useEffect(() => {
    if (
      !cookie.access_token &&
      !cookie.refresh_token &&
      !cookie.access_token_guest
    )
      return;

    if (!cookie.access_token && cookie.refresh_token) {
      // fetch the refresh token
      getRefreshToken(setCookies, cookie);
      return;
    }

    spotifyApi.setAccessToken(cookie.access_token ?? cookie.access_token_guest);
  }, [cookie.access_token, cookie.access_token_guest]);

  return { spotifyApi, currentUser };
};

export default useSpotify;
