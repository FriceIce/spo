import qs from "qs";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { UserCredential } from "../../definition";
import { authHeader } from "../../modules/fetchToken";
import Modal from "../../components/Modal";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

const mobile_localhost = import.meta.env.VITE_AUTH_URL_MOBILE;
const desktop_host = import.meta.env.VITE_AUTH_URL_HOSTING;
const desktop_localhost = import.meta.env.VITE_AUTH_URL_DESKTOP;
const device_hostname = window.location.hostname;

const Authentication = () => {
  const [showModal, setShowModal] = useState(true);
  const [_, setCookies] = useCookies(["access_token_guest", "refresh_token"]);

  const dispatch = useDispatch();
  const current_user_device =
    device_hostname === "localhost"
      ? desktop_localhost
      : device_hostname === "friceice.github.io"
      ? desktop_host
      : mobile_localhost;

  const authentication_url = current_user_device as string;

  const runFetchTokenFunction = async () => {
    const hostname = window.location.hostname;
    const query = qs.stringify({
      grant_type: "client_credentials",
    });

    const response = await fetch(
      `https://accounts.spotify.com/api/token?` + query,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${authHeader}`,
        },
      }
    );

    const data = (await response.json()) as UserCredential;

    if (data.access_token) {
      const protocol = window.location.protocol;
      setCookies("access_token_guest", data.access_token, {
        path: "/spotify-web/",
        domain: hostname,
        secure: protocol === "https:" ? true : false,
        expires: new Date(Date.now() + 3600000), // 55min
      });

      dispatch({ type: "user/setGuest", payload: true });
      return;
    }
  };

  return (
    <>
      <AnimatePresence>
        {showModal && <Modal type="development" state={setShowModal} />}
      </AnimatePresence>
      <div className="bg-spotify_black h-screen pt-40 px-2">
        <div className="flex flex-col items-center justify-center gap-3 lg:gap-6">
          <div className="flex gap-2 lg:gap-4 items-center mx-auto">
            <h1 className="font-bold text-xl text-balance text-center sm:text-2xl md:text-3xl lg:text-5xl transition-all duratiion-200">
              Welcome to my{" "}
              <span className="text-spotify_green">Spotify project</span>
            </h1>

            <img
              src="/spotify-web/icons/spotify-logo.svg"
              alt=""
              className="size-6 lg:size-10"
            />
          </div>

          <div className="space-y-2 items-center flex-col flex justify-center">
            <a
              href={authentication_url}
              className="bg-spotify_green text-black text-xs lg:text-base font-semibold px-6 py-[8px] lg:px-16 lg:py-[12px] rounded-full lg:hover:scale-105 transition-all"
            >
              <button className="">Log in with Spotify</button>
            </a>
            <button
              onClick={runFetchTokenFunction}
              className="bg-white text-black text-xs lg:text-base font-semibold px-6 py-[8px] lg:px-16 lg:py-[12px] rounded-full lg:hover:scale-105 transition-all w-full"
            >
              Log in as Guest
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Authentication;
