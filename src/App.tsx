//React Router
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import SpotifyWebPlayer from "react-spotify-web-playback";
import Modal from "./components/Modal";
import RepeatButton from "./components/RepeatButton";
import ShuffleButton from "./components/ShuffleButton";
import Sidebar from "./components/Sidebar";
import UserLibraryList from "./components/UserLibraryList";
import useAuth from "./hooks/useAuth";
import useFetchMe from "./hooks/useFetchToken";
import { useMediaQuery } from "./hooks/useMediaQueries";
import Album from "./pages/Album/SpecificAlbum";
import Artist from "./pages/Artist/Artist";
import Authentication from "./pages/Authentication/Authentication";
import Home from "./pages/Home/Home";
import Playlist from "./pages/Playlist/specificPlaylist";
import Search from "./pages/Search/Search";
import { RootState } from "./redux/store";

//Spotify API
function App() {
  const [openModal, setOpenModal] = useState<boolean>(true);
  const [cookie] = useCookies(["access_token", "access_token_guest"]);
  const [play, setPlay] = useState(false);

  const { uris, offset, shuffle, activeTrack } = useSelector(
    (state: RootState) => state.playback
  );
  const { user, guest } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const isDesktop = useMediaQuery("1024px");
  useAuth();
  useFetchMe();

  useEffect(() => {
    if (cookie.access_token_guest) {
      dispatch({ type: "user/setGuest", payload: true });
    }
    // checks for an access token linked to the guest user
    if (user && user.product !== "premium")
      alert(
        "You're not a Spotify Premium user, you won't be able to access the music player."
      );
  }, [user]);

  const playbackExtraComponents = {
    rightButton: <RepeatButton />,
    leftButton: <ShuffleButton shuffle={shuffle} uris={uris} />,
  };

  useEffect(() => {
    if (uris.length > 0) setPlay(true);
  }, [uris]);
  // useEffect(() => setAccessToken(cookie.access_token), [cookies.access_token])

  if (!cookie.access_token && !cookie.access_token_guest && !user && !guest)
    return <Authentication />;

  return (
    <>
      <AnimatePresence>
        {openModal && guest && <Modal type="guest" state={setOpenModal} />}
      </AnimatePresence>
      <div className="">
        <main
          className={`bg-black relative h-dvh w-screen flex ${
            !guest && "lg:pb-[80px]"
          }
          ${
            activeTrack && !guest
              ? "pb-[202px]"
              : guest && !isDesktop
              ? "pb-16"
              : guest && isDesktop
              ? "pb-0"
              : "pb-[50px]"
          }`}
        >
          <Sidebar />
          <div
            className="relative bg-spotify_black flex-1 overflow-y-auto overflow-x-hidden no-scrollbar"
            id="wrapper"
          >
            <Routes>
              <Route path="/spotify-web/" element={<Home />} />
              <Route path="/spotify-web/album/:id" element={<Album />} />
              <Route path="/spotify-web/playlist/:id" element={<Playlist />} />
              <Route path="/spotify-web/artist/:id" element={<Artist />} />
              <Route path="/spotify-web/search" element={<Search />} />
              {!isDesktop && (
                <Route
                  path="/spotify-web/user-library"
                  element={<UserLibraryList openSidebar={false} />}
                />
              )}
            </Routes>
          </div>
        </main>

        {!guest && (
          <div
            className={`${
              activeTrack || isDesktop ? "block" : "hidden"
            } absolute bottom-[70px] z-30 lg:bottom-0 w-full`}
          >
            <SpotifyWebPlayer
              name="Spotify project"
              play={play}
              showSaveIcon
              uris={uris}
              components={playbackExtraComponents}
              token={cookie.access_token}
              initialVolume={0.3}
              magnifySliderOnHover
              syncExternalDevice={true}
              offset={offset}
              callback={(state) => {
                if (!state.isPlaying) {
                  setPlay(false);
                  dispatch({ type: "playback/setIsPaused", payload: true });
                }

                if (state.isPlaying)
                  dispatch({ type: "playback/setIsPaused", payload: false });

                // This keeps the global state (activeTrack) updated when the player changes track, which render the green color text for playing tracks.
                if (state.track && state.isPlaying)
                  dispatch({
                    type: "playback/setActiveTrack",
                    payload: state.track.uri,
                  });
              }}
              styles={{
                bgColor: "black",
                color: "white",
                trackNameColor: "white",
                sliderHandleColor: "white",
                sliderColor: "#1ed760",
                sliderTrackColor: "#cccccc",
              }}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
