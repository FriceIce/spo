import axios from "axios";
import { SpotifyAuthResponse } from "../definition";

const client_id = import.meta.env.VITE_CLIENT_ID;
const client_secret = import.meta.env.VITE_CLIENT_SECRET;

function encodeBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}
export const authHeader: string = encodeBase64(`${client_id}:${client_secret}`);

export const fetchToken = async (query: string, setCookies: any) => {
  const hostname = window.location.hostname;
  const mobileHosting = hostname.includes("192"); // Incase this application is running on a mobile device locally
  const response = await axios.post(
    `https://accounts.spotify.com/api/token`,
    query,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${authHeader}`,
      },
    }
  );

  console.log(response.data);
  const data = (await response.data) as SpotifyAuthResponse;

  if (response.data.refresh_token) {
    setCookies("refresh_token", data.refresh_token, {
      path: "/spotify-web/",
      domain: hostname,
      secure: mobileHosting ? false : true,
    });
  }

  // The access token should be set even if the refresh token is null or undefined.
  setCookies("access_token", data.access_token, {
    path: "/spotify-web/",
    secure: mobileHosting ? false : true,
    domain: hostname,
    expires: new Date(Date.now() + 3300000), // 55min
  });
};
