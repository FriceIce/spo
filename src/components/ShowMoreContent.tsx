import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Dispatch } from "react";
import { Album, Playlist, SearchTracks } from "../definition";
import AlbumCard from "./AlbumCard";
import ArtistCard from "./ArtistCard";
import PlaylistCard from "./PlaylistCard";
import TracksCard from "./TracksCard";

type ContentTyp = [
  SearchTracks[],
  SearchTracks[],
  Playlist[],
  Album[],
  SpotifyApi.ArtistObjectFull[]
];

const ShowMoreContent = ({
  contentType,
  title,
  type,
  setShowMore,
  recommendations,
}: {
  contentType: ContentTyp;
  title: string;
  type: "track" | "playlist" | "album" | "artist" | "recommendations";
  setShowMore: Dispatch<
    React.SetStateAction<
      "track" | "playlist" | "album" | "artist" | "recommendations" | null
    >
  >;
  recommendations: SearchTracks[];
}) => {
  const isRecentlyPlayed =
    type === "track" ? 20 : contentType.flat().length - 1;

  return (
    <div className="space-y-6">
      <div className="flex gap-2 items-end mt-5">
        <button
          className="hidden size-10 lg:grid place-items-center bg-[#00000062] rounded-full mx-4 border transition-all hover:scale-105"
          onClick={() => setShowMore(null)}
        >
          <ArrowLeftIcon className="size-6" />
        </button>
        <h1 className="text-lg lg:text-5xl font-bold">{title}</h1>
      </div>

      {type !== "recommendations" ? (
        <ul className="card-layout mx-2 gap-[1px]">
          {contentType
            .flat()
            .slice(0, isRecentlyPlayed)
            .map((card, index) => {
              const arrayOfTracks =
                card.type === "track" &&
                contentType.flat().filter((track) => track.type === "track");

              if (type === "track" && card.type === "track")
                return (
                  <li className="">
                    <TracksCard
                      card={card}
                      arrayOfTracks={arrayOfTracks as SearchTracks[]}
                      index={index}
                      homepage
                    />
                  </li>
                );

              if (type === "playlist" && card.type === "playlist")
                return (
                  <li className="">
                    <PlaylistCard
                      playlistData={card}
                      homepage
                      sidemenu={false}
                    />
                  </li>
                );

              if (type === "album" && card.type === "album")
                return (
                  <li className="">
                    <AlbumCard albumData={card} isHomepage />
                  </li>
                );

              if (type === "artist" && card.type === "artist")
                return (
                  <li className="">
                    <ArtistCard card={card} homepage />
                  </li>
                );
            })
            .slice()}
        </ul>
      ) : (
        <ul className="card-layout mx-2 gap-[1px]">
          {recommendations.flat().map((card, index) => {
            const arrayOfTracks =
              card.type === "track" &&
              contentType.flat().filter((track) => track.type === "track");

            return (
              <li className="">
                <TracksCard
                  card={card}
                  arrayOfTracks={arrayOfTracks as SearchTracks[]}
                  index={index}
                  homepage
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default ShowMoreContent;
