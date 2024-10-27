import { useSelector } from "react-redux";
import { Playlist } from "../definition";
import { useMediaQuery } from "../hooks/useMediaQueries";
import useNav from "../hooks/useNav";
import { RootState } from "../redux/store";
import MusicButtonAnimation from "./Spinner/MusikButtonAnimation/MusikButtonAnimation";

const PlaylistCard = ({
  playlistData,
  homepage,
  sidemenu,
  openSidebar,
}: {
  playlistData: Playlist | SpotifyApi.PlaylistObjectSimplified;
  homepage?: boolean;
  sidemenu?: boolean;
  openSidebar?: boolean;
}) => {
  const guest = useSelector((state: RootState) => state.user.guest);
  const pathnameIsArtist = window.location.pathname.includes("artist");
  const pathnameIsLibrary =
    window.location.pathname === "/spotify-web/user-library"; // boolean - This used for images radius

  const nextPath = useNav();
  const id = playlistData.id;
  const ownerName = playlistData.owner;
  const isDesktop = useMediaQuery("1024px");

  const images = [
    playlistData.images,
    { url: "/spotify-web/icons/no-image.svg" },
  ].flat();
  const playlistOwner =
    playlistData.owner.display_name?.toLowerCase() !== "spotify" &&
    images.length > 2;
  const playlistCoverImg = images.sort((a: any, b: any) => a.height - b.height)[
    playlistOwner ? 1 : 0
  ].url;

  return (
    <div
      className={`group relative flex justify-between gap-6 cursor-pointer w-full transition-all 
      ${
        ((!sidemenu && isDesktop) || homepage) &&
        "p-1 lg:p-3 lg:hover:bg-[#31313181] rounded-md"
      }`}
      onClick={() => nextPath(id, "playlist")}
    >
      <div
        className={`flex gap-2 h-fit lg:items-start overflow-x-hidden
        ${homepage || pathnameIsArtist ? "flex-col items-start" : "items-end"}
        lg:${!sidemenu && "flex-col"} `}
      >
        <div className="relative h-full">
          {!sidemenu && isDesktop && <MusicButtonAnimation />}

          <img
            src={
              playlistCoverImg
                ? playlistCoverImg
                : "/spotify-web/icons/no-image.svg"
            }
            alt=""
            className={`${
              homepage || (pathnameIsArtist && !sidemenu)
                ? `${guest ? "size-full" : "size-[140px]"}`
                : pathnameIsLibrary && !isDesktop
                ? "min-w-[100px] max-w-[100px]"
                : sidemenu
                ? "size-16 min-w-16"
                : "size-14 min-w-14"
            } shadow object-cover object-center rounded-[2px] lg:rounded ${
              !sidemenu && "lg:size-full"
            }`}
          />
        </div>

        <div
          className={`${
            !openSidebar && sidemenu && "lg:hidden"
          } space-y-1 overflow-x-hidden w-full
         ${!sidemenu && "lg:w-[200px]"} ${pathnameIsLibrary && "mb-2"}`}
        >
          <p
            className={`text-white w-full truncate font-semibold text-sm lg:text-wrap lg:line-clamp-2
            ${homepage && "line-clamp-2 text-wrap"} ${
              pathnameIsArtist && "text-center line-clamp-2"
            }`}
          >
            {playlistData.name}
          </p>

          <div className="flex items-center gap-1">
            <p
              className={`capitalize text-xs text-spotify_gray truncate ${
                pathnameIsArtist && "hidden"
              }`}
            >
              {isDesktop
                ? `By ${ownerName ? ownerName.display_name : "Unkown"}`
                : playlistData.type}
            </p>
          </div>
        </div>
      </div>
      {/* <SettingsComponent /> */}
    </div>
  );
};

export default PlaylistCard;
