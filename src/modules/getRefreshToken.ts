import axios from "axios";

export const getRefreshToken = async (setCookies: any, cookie: any) => {
  // refresh token that has been previously stored
  const refreshToken: string | undefined = cookie.refresh_token;

  if (!refreshToken) {
    console.error("No refresh token found");
    return;
  }
  console.log(refreshToken);

  const response = await axios.post(
    "https://spotify-web-jrq3.onrender.com/api/refreshToken",
    {
      refresh_token: refreshToken,
    }
  );
  const data = response.data;

  if (!data) {
    return alert(
      "Sorry, we were unable to continue your session. Please refresh the page and log in again."
    );
  }

  setCookies("access_token", data.access_token, {
    path: "/spotify-web/",
    domain: "localhost",
    expires: new Date(Date.now() + 3600000), // 1h
  });

  if (data.refreshToken) {
    setCookies("refresh_token", data.access_token, {
      path: "/spotify-web/",
      domain: "localhost",
      expires: new Date(Date.now() + 3600000), // 1h
    });
  }
};
