import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Dispatch } from "react";
import { Album, SearchTracks } from "../definition";
import AlbumCard from "./AlbumCard";
import ArtistCard from "./ArtistCard";
import TracksCard from "./TracksCard";
import PlaylistCard from "./PlaylistCard";

type ContentTyp = [
  SearchTracks[],
  Album[],
  SpotifyApi.ArtistObjectFull[],
  SpotifyApi.PlaylistObjectSimplified[]
];

const ShowMoreContent = ({
  contentType,
  title,
  type,
  setShowMore,
}: {
  contentType: ContentTyp;
  title: string;
  type: "track" | "playlist" | "album" | "artist" | "recommendations";
  setShowMore: Dispatch<
    React.SetStateAction<
      "track" | "playlist" | "album" | "artist" | "recommendations" | null
    >
  >;
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

      {
        <ul className="card-layout mx-2 gap-[1px]">
          {contentType
            .flat()
            .slice(0, isRecentlyPlayed)
            .map((card, index) => {
              if (!card) return;
              const arrayOfTracks =
                card.type === "track" &&
                contentType.flat().filter((track) => {
                  if (!track) return;
                  return track.type === "track";
                });

              if (type === "track" && card.type === "track")
                return (
                  <li key={card.id} className="">
                    <TracksCard
                      card={card}
                      arrayOfTracks={arrayOfTracks as SearchTracks[]}
                      index={index}
                      homepage
                    />
                  </li>
                );

              if (type === "album" && card.type === "album")
                return (
                  <li key={card.id} className="">
                    <AlbumCard albumData={card} isHomepage />
                  </li>
                );

              if (type === "artist" && card.type === "artist")
                return (
                  <li key={card.id} className="">
                    <ArtistCard card={card} homepage />
                  </li>
                );

              if (type === "playlist" && card.type === "playlist") {
                return (
                  <li key={card.id} className="">
                    <PlaylistCard playlistData={card} homepage />
                  </li>
                );
              }
            })
            .slice()}
        </ul>
      }
    </div>
  );
};

export default ShowMoreContent;
