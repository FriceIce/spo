import qs from "qs";
import Modal from "../../components/Modal";
import { UserCredential } from "../../definition";
import { authHeader } from "../../modules/fetchToken";
import { AnimatePresence } from "framer-motion";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { useState } from "react";
import axios from "axios";

const Authentication = () => {
  const [showModal, setShowModal] = useState(true);
  const [_, setCookies] = useCookies(["access_token_guest", "refresh_token"]);

  const dispatch = useDispatch();
  const auth_url = authentication_url();

  const runFetchTokenFunction = async () => {
    const hostname = window.location.hostname;

    const response = await axios.post<UserCredential>(
      "http://localhost:3001/api/guestLogin"
    );
    const data = response.data;

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
              href={auth_url}
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

// Authentication url for sign in with Spotify. It uses the en users origin to set the redirect_uri.
const authentication_url = () => {
  const client_id = import.meta.env.VITE_CLIENT_ID;
  return `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${window.location.origin}/spotify-web/callback&scope=user-read-private user-read-email user-library-read user-follow-read playlist-read-private playlist-read-collaborative user-modify-playback-state streaming app-remote-control user-read-playback-state user-read-currently-playing ugc-image-upload user-library-modify user-read-recently-played user-top-read user-read-playback-position playlist-modify-private`;
};
