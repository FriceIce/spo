import { PauseIcon, PlayIcon } from "@heroicons/react/16/solid";
import { useDispatch, useSelector } from "react-redux";
import { SearchTracks } from "../definition";
import { useMediaQuery } from "../hooks/useMediaQueries";
import useSpotify from "../hooks/useSpotify";
import checkForImages from "../modules/checkForImages";
import { musicStateForTrack } from "../modules/musicState";
import { RootState } from "../redux/store";
import ConvertToMilisec from "./ConvertToMilisec";
import SettingsComponent from "./SettingsComponent";
import MusicBars from "./Spinner/MusicBars/MusicBars";
import MusicButtonAnimation from "./Spinner/MusikButtonAnimation/MusikButtonAnimation";

export const trackUris = (
  arrayOfTracks: SpotifyApi.TrackObjectFull[] | SearchTracks[]
) => {
  return arrayOfTracks.map((track) => track.uri);
};

const TracksCard = ({
  card: track,
  arrayOfTracks,
  homepage,
  index,
}: {
  card: SearchTracks | SpotifyApi.TrackObjectFull;
  arrayOfTracks: SearchTracks[] | SpotifyApi.TrackObjectFull[]; // For music-player
  index: number;
  homepage?: boolean;
}) => {
  const guest = useSelector((state: RootState) => state.user.guest);
  const { activeTrack, paused } = useSelector(
    (state: RootState) => state.playback
  );
  const dispatch = useDispatch();
  const trackDuration: number = track.duration_ms;
  const { spotifyApi } = useSpotify();
  const desktop = useMediaQuery("1024px");
  const pathnameIsSearch = window.location.pathname.includes("search");
  const pathnameIsArtist = window.location.pathname.includes("artist");
  // Redux state is immutable and therefore we need to create a new array
  const sortImgByHeight = checkForImages(
    [...track.album.images].sort((a: any, b: any) => a.height - b.height)
  );

  return (
    <div
      className={`group w-full relative flex justify-between rounded-md transition-all gap-6 cursor-pointer lg:hover:opacity-80 lg:hover:bg-[#31313181]
     ${
       homepage
         ? "p-1 lg:p-3 lg:hover:bg-[#31313181]"
         : pathnameIsArtist && "lg:px-3 py-2"
     }`}
    >
      <div
        className={`flex ${
          homepage ? "flex-col" : "flex-row"
        } gap-2 h-fit w-[100%]`}
        onClick={() => {
          if (guest) return;
          musicStateForTrack({
            track,
            arrayOfTracks,
            index,
            spotifyApi,
            dispatch,
            trackUris,
            paused,
            activeTrack,
          });
        }}
      >
        {
          <div className="relative">
            {activeTrack === track.uri && !paused && (
              <PauseIcon
                className={`hidden lg:group-hover:${
                  homepage ? "hidden" : "group-hover:block"
                } size-5 text-white absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]`}
                onClick={() => {
                  if (guest) return;
                  spotifyApi.pause();
                }}
              />
            )}

            {((paused && track.uri === activeTrack) ||
              track.uri !== activeTrack) && (
              <PlayIcon
                className={`hidden lg:group-hover:${
                  homepage ? "hidden" : "group-hover:block"
                } size-5 text-white absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]`}
                onClick={() => {
                  if (guest) return;
                  spotifyApi.play();
                }}
              />
            )}

            <div className="relative h-full">
              {homepage && desktop && <MusicButtonAnimation />}

              <img
                src={
                  sortImgByHeight
                    ? sortImgByHeight
                    : "/spotify-web/icons/no-image.svg"
                }
                alt="Album cover"
                className={`${
                  homepage
                    ? "size-full min-h-[142px] min-w-[142px]"
                    : "size-full max-w-14 max-h-14"
                }
              rounded-[2px] lg:rounded object-cover object-center shadow`}
              />
            </div>
          </div>
        }

        <div
          className={`space-y-1 flex-1 overflow-x-hidden ${
            homepage ? "max-w-[200px] w-full" : "w-0"
          }`}
        >
          <div className="flex gap-2">
            {activeTrack === track.uri &&
              paused === false &&
              pathnameIsSearch &&
              desktop && <MusicBars />}
            <p
              className={`font-semibold text-sm truncate lg:text-wrap lg:line-clamp-2 ${
                activeTrack === track.uri ? "text-spotify_green" : "text-white"
              }`}
            >
              {track.name}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <p className="capitalize text-xs text-spotify_gray truncate">
              {homepage ? "By" : track.type} &#x2022;
              {" " + track.artists.map((artist) => artist.name).join(", ")}
            </p>
          </div>
        </div>
      </div>

      <div className={`sm:hidden ${homepage && "hidden"}`}>
        <SettingsComponent
          external_source_to_spotify={track.external_urls.spotify}
        />
      </div>
      {!homepage && (
        <div className="hidden lg:block">
          <ConvertToMilisec value={trackDuration} />
        </div>
      )}
    </div>
  );
};

export default TracksCard;
