import { Artist } from "../definition";
import { useMediaQuery } from "../hooks/useMediaQueries";
import useNav from "../hooks/useNav";

const ArtistCard = ({
  card,
  homepage,
}: {
  card: Artist | SpotifyApi.ArtistObjectFull;
  homepage?: boolean;
}) => {
  const desktop = useMediaQuery("1024px");
  const navigation = useNav();
  const isArtistPathname = window.location.pathname.includes("artist");

  // Redux state is immutable and therefore the need to create a new array
  const minimumImage = [...card.images].sort(
    (a: any, b: any) => a.height - b.height
  )[desktop || homepage || isArtistPathname ? 1 : 0];

  return (
    <>
      <div
        className={`flex-1 flex gap-6 cursor-pointer rounded-md transition-all lg:p-3 lg:hover:bg-[#31313181] ${
          homepage && "p-1 "
        }`}
        onClick={() => navigation(card.id, "artist")}
      >
        <div
          className={`flex ${
            homepage || isArtistPathname ? "flex-col items-start" : "items-end"
          } gap-3 h-fit lg:flex-col lg:items-start`}
        >
          <img
            src={
              minimumImage
                ? minimumImage.url
                : "/spotify-web/icons/artist_no_image.svg"
            }
            alt="Artist image"
            className={`${
              homepage || isArtistPathname
                ? "size-[150px] lg:aspect-auto"
                : "size-14"
            } rounded-full lg:size-[180px] lg:min-w-[180px] object-cover object-center shadow`}
          />

          <div className="overflow-x-hidden lg:ml-4 ">
            <p className="text-white font-semibold text-sm lg:text-base truncate text-wrap line-clamp-2">
              {card.name}
            </p>
            <div className="flex items-center gap-1">
              <p className="capitalize text-xs text-spotify_gray truncate">
                {card.type}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArtistCard;
