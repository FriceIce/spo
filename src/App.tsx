//React Router
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import SpotifyWebPlayer from "react-spotify-web-playback";
import Header from "./components/Header";
import RepeatButton from "./components/RepeatButton";
import ShuffleButton from "./components/ShuffleButton";
import Sidebar from "./components/Sidebar";
import useAuth from "./hooks/useAuth";
import useFetchMe from "./hooks/useFetchToken";
import Album from "./pages/Album/SpecificAlbum";
import Home from "./pages/Home/Home";
import Playlist from "./pages/Playlist/specificPlaylist";
import Search from "./pages/Search/Search";
import { RootState } from "./redux/store";
import Artist from "./pages/Artist/Artist";
import Authentication from "./pages/Authentication/Authentication";
import UserLibraryList from "./components/UserLibraryList";
import { useMediaQuery } from "./hooks/useMediaQueries";
import useComponentIsMounted from "./hooks/useIsMounted";

//Spotify API
function App() {
  const [cookie] = useCookies(["access_token"]);
  const [play, setPlay] = useState(false);

  const { uris, offset, shuffle, activeTrack } = useSelector(
    (state: RootState) => state.playback
  );
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();

  const isDesktop = useMediaQuery("1024px");
  useAuth();
  useFetchMe();

  useComponentIsMounted(() => {
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

  if (!cookie.access_token && !user) return <Authentication />;

  return (
    <div className="">
      <main
        className={`bg-black relative h-dvh w-screen flex lg:pb-[80px]
        ${activeTrack ? "pb-[202px]" : "pb-[50px]"}`}
      >
        <BrowserRouter>
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
        </BrowserRouter>
      </main>

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
    </div>
  );
}

export default App;
