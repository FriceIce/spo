import { useDispatch, useSelector } from "react-redux";

// TS types
import {
  Album,
  Artist,
  CombinedSpotifySearch,
  Playlist,
  SearchTracks,
  TopResult,
} from "../definition";

// components
import { RootState } from "../redux/store";
import AlbumCard from "./AlbumCard";
import ArtistCard from "./ArtistCard";
import PlaylistCard from "./PlaylistCard";
import MusicButtonAnimation from "./Spinner/MusikButtonAnimation/MusikButtonAnimation";
import TracksCard from "./TracksCard";

type Prop = {
  desktop: boolean;
  topResult: TopResult;
  searchResults: CombinedSpotifySearch[];
  nextPath: (id: string, path: string) => void;
};

const TopResultComponent = ({
  topResult,
  searchResults,
  nextPath,
  desktop,
}: Prop) => {
  const guest = useSelector((state: RootState) => state.user.guest);
  const { activeTrack } = useSelector((state: RootState) => state.playback);
  const dispatch = useDispatch();

  const type = (result: TopResult) => {
    if (result.type === "track")
      return result.artists.map((asrtist) => asrtist.name).join(", ");
    if (result.type === "playlist") return result.owner.display_name;
    if (result.type === "album" || result.type === "artist") return result.name;
  };

  const typeIsTrack = topResult.type === "track";
  const URI = searchResults
    .filter((object: any) => object.type === "track")
    .map((track: any) => track.uri);
  const TOP_SONGS = searchResults
    .filter((object: any) => object.type === "track")
    .slice(0, 5) as SearchTracks[];

  return (
    <div className="hidden lg:block space-y-16 max-w-[1500px]">
      <div className="flex gap-4 cursor pointer flex-wrap max-w-[1400px]">
        <div
          className=" space-y-2 flex-1 min-w-[400px] max-w-[550px]"
          onClick={() => {
            if (!typeIsTrack) nextPath(topResult.id, topResult.type);
          }}
        >
          <h2 className="font-bold text-2xl">Top result</h2>
          <div className="relative group bg-[#181818] hover:bg-[#1f1f1f] p-4 rounded-md flex flex-col gap-3 transition cursor-pointer">
            <MusicButtonAnimation />
            <img
              src={
                topResult.type !== "track"
                  ? [...topResult.images].sort((a: any, b: any) => a - b)[0].url
                  : [...topResult.album.images].sort(
                      (a: any, b: any) => a - b
                    )[0].url
              }
              alt="Playlist thumbnail"
              className={`size-[150px] md:size-[200px] object-cover object-center shadow 
              ${topResult.type !== "track" ? "rounded-full" : "rounded-md"}`}
            />
            <div className="space-y-2 w-full">
              <h3 className="font-bold text-4xl truncate lg:text-wrap">
                {topResult.name}
              </h3>
              <p className="text-spotify_gray text-sm capitalize line-clamp-2">
                {topResult.type} &#x2022;{" "}
                <span className="text-white font-bold">{type(topResult)}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2 flex-1 min-w-[400px]">
          <h2 className="font-bold text-2xl">Songs</h2>
          <ul className="flex flex-col gap-2 h-[312px]">
            {TOP_SONGS.map((track: any, index: number) => {
              return (
                <li
                  key={track.id}
                  className="relative cursor-pointer"
                  onClick={() => {
                    if (guest) return;
                    if (activeTrack !== track.uri)
                      dispatch({
                        type: "playback/setUri",
                        payload: { uris: URI, offset: index },
                      });
                  }}
                >
                  <TracksCard
                    card={track}
                    index={index}
                    arrayOfTracks={TOP_SONGS}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="font-bold text-2xl">Artists</h2>
        <ul className={`no-scrollbar ${desktop ? "slider-grid" : "flex"}`}>
          {searchResults
            .filter((object) => object.type === "artist")
            .map((artist: Artist, index: number) => {
              // if(topResult.id === artist.id) return;

              return (
                <li key={artist.id + index} className="flex-none flex">
                  <ArtistCard card={artist} />
                </li>
              );
            })}
        </ul>
      </div>
      <div className="space-y-4">
        <h2 className="font-bold text-2xl">Albums</h2>
        <ul className={`no-scrollbar ${desktop ? "slider-grid" : "flex"}`}>
          {searchResults
            .filter((object) => object.type === "album")
            .map((album: Album, index: number) => {
              // if(topResult.id === album.id) return;
              return (
                <li key={album.id + index} className="flex-none flex">
                  <AlbumCard albumData={album} />
                </li>
              );
            })}
        </ul>
      </div>
      <div className="space-y-4">
        <h2 className="font-bold text-2xl">Playlists</h2>
        <ul className={`no-scrollbar ${desktop ? "slider-grid" : "flex"}`}>
          {searchResults
            .filter((object) => object.type === "playlist")
            .map((album: Playlist, index: number) => {
              // if(topResult.id === album.id) return;
              return (
                <li key={album.id + index} className="flex-none flex">
                  <PlaylistCard playlistData={album} />
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default TopResultComponent;
