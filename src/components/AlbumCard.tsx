import { Album } from "../definition";
import { useMediaQuery } from "../hooks/useMediaQueries";
import useNav from "../hooks/useNav";
import MusicButtonAnimation from "./Spinner/MusikButtonAnimation/MusikButtonAnimation";

const AlbumCard = ({
  albumData,
  isHomepage,
}: {
  albumData: Album | SpotifyApi.AlbumObjectSimplified;
  isHomepage?: boolean;
}) => {
  const nextPath = useNav();
  const isDesktop = useMediaQuery("1024px");
  const pathnameIsArtist = window.location.pathname.includes("artist");

  const sortImgByHeight = [
    ...albumData.images,
    { url: "/spotify-web/icons/no-image.svg" },
  ].sort((a: any, b: any) => a.height - b.height);
  const image = sortImgByHeight[sortImgByHeight.length > 2 ? 1 : 0].url;

  const release_date_year = albumData.release_date.split("-")[0];
  const mediaQuerySM = useMediaQuery("640px");

  return (
    <div
      className={`relative group flex justify-between gap-6 cursor-pointer transition-all 
      ${
        (isDesktop || isHomepage) &&
        "p-1 lg:p-3 lg:hover:bg-[#31313181] rounded-md"
      }`}
      onClick={() => nextPath(albumData.id, "album")}
    >
      <div
        className={`flex ${
          !isHomepage && "items-center"
        } gap-3 h-fit lg:flex-col 
        ${isHomepage && "flex-col"} sm:items-start w-full `}
      >
        <div className="relative h-full">
          {isDesktop && <MusicButtonAnimation />}

          <img
            src={image}
            alt="Album cover"
            className={`rounded-lg object-cover object-center shadow
            ${
              isHomepage || (pathnameIsArtist && isDesktop)
                ? "size-full"
                : !isDesktop && pathnameIsArtist
                ? "size-[100px] max-w-[100px]"
                : "size-14 lg:size-full"
            } 
            rounded-[1.5px] lg:rounded-[4px]`}
          />
        </div>

        <div className="overflow-x-hidden space-y-1">
          <p
            className={`text-white font-semibold text-sm truncate text-wrap lg:line-clamp-2
            ${isHomepage && "text-wrap line-clamp-2"}`}
          >
            {albumData.name}
          </p>

          <div className="flex items-center gap-1">
            <p
              className={`capitalize text-xs text-spotify_gray truncate lg:text-wrap lg:line-clamp-2
              ${isHomepage && "text-wrap line-clamp-2"}`}
            >
              {mediaQuerySM || pathnameIsArtist
                ? release_date_year
                : albumData.type}{" "}
              &#x2022;{" "}
              {albumData.artists.map((artist) => artist.name).join(", ")}
            </p>
          </div>
        </div>
      </div>
      {/* <SettingsComponent /> */}
    </div>
  );
};

export default AlbumCard;
