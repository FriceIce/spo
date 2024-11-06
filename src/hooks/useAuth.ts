import qs from "qs";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { fetchToken } from "../modules/fetchToken";

const client_id = import.meta.env.VITE_CLIENT_ID;

const useAuth = () => {
  const [_, setCookies] = useCookies(["access_token", "refresh_token"]);
  const origin = window.location.origin;
  const param = new URL(window.location.href).searchParams;
  const code = param.get("code")?.trim();
  const codeVerifier = localStorage.getItem("code_verifier");

  useEffect(() => {
    // When the user sign in with Spotify for the first time this will run
    if (code) {
      fetchToken(
        qs.stringify({
          code,
          client_id,
          grant_type: "authorization_code",
          redirect_uri: `${origin}/spotify-web/callback`,
          code_verifier: codeVerifier,
        }),
        setCookies
      ).then(() => (window.location.href = `${origin}/spotify-web/`));
    }

    return () => {};
  }, []);

  return code ? true : false;
};

export default useAuth;
