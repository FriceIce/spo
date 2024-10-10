import { authHeader } from "./fetchToken";

export const getRefreshToken = async (setCookies: any, cookie: any) => {
  // refresh token that has been previously stored
  const refreshToken = cookie.refresh_token;
  const url = "https://accounts.spotify.com/api/token";

  if (!refreshToken) {
    console.error("No refresh token found");
    return;
  }

  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${authHeader}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: import.meta.env.VITE_CLIENT_ID as string,
    }),
  };

  const body = await fetch(url, payload);
  const response = await body.json();
  console.log(response);

  setCookies("access_token", response.access_token, {
    path: "/spotify-web/",
    domain: "localhost",
    expires: new Date(Date.now() + 3600000), // 1h
  });

  if (response.refreshToken) {
    localStorage.setItem("refresh_token", response.refreshToken);
  }
};
