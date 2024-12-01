import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import useActivePath from "../hooks/useActivePath";
import { useMediaQuery } from "../hooks/useMediaQueries";
import useSpotify from "../hooks/useSpotify";
import { RootState } from "../redux/store";
import PlaylistCard from "./PlaylistCard";
import SidebarSpinner from "./Spinner/SidebarSpinner/SidebarSpinner";

const UserLibraryList = ({ openSidebar }: { openSidebar: boolean }) => {
  const guest = useSelector((state: RootState) => state.user.guest);

  const user = useSelector((state: RootState) => state.user.user);
  const activeTrack = useSelector(
    (state: RootState) => state.playback.activeTrack
  );
  const { spotifyApi } = useSpotify();
  const pathname = window.location.pathname === "/spotify-web/user-library"; // boolean
  const isDesktop = useMediaQuery("1024px");
  useActivePath(isDesktop ? null : "library");

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ["user libraryList"],
    queryFn: async () =>
      await spotifyApi.getUserPlaylists(user?.id).then((playlist) => {
        return playlist.items;
      }),
  });

  useEffect(() => {
    if (data) console.log(data);
  }, [data]);

  if (guest && !isDesktop)
    return (
      <h1 className="lg:text-3xl font-bold mt-10 mx-auto w-max">
        This content is unavailable for guest users.
      </h1>
    );

  if (isLoading)
    return (
      <div className={`${pathname ? "pt-32" : "pt-2"}`}>
        <SidebarSpinner />
      </div>
    );

  if (isSuccess && data)
    return (
      <div
        className={`space-y-4 ${
          pathname && activeTrack && isDesktop && "mb-2"
        } lg:mb-0`}
      >
        <div
          className={`flex items-center gap-2 mt-6 mx-2 ${
            !pathname && "hidden"
          }`}
        >
          <img
            src={
              user?.images
                ? user.images[0].url
                : "/spotify-web/icons/no-profile-pic.svg"
            }
            alt=""
            className="size-8 object-contain rounded-full"
          />
          <h1 className={`font-extrabold text-2xl`}>Your library</h1>
        </div>
        <ul className={`flex flex-col gap-3 ${pathname && "mx-2 pb-8"}`}>
          {data.map((playlist) => {
            if (!playlist) return;
            return (
              <li key={playlist.id} title={playlist.name}>
                <PlaylistCard
                  playlistData={playlist}
                  sidemenu={true}
                  openSidebar={openSidebar}
                />
              </li>
            );
          })}
        </ul>
      </div>
    );
};

export default UserLibraryList;
