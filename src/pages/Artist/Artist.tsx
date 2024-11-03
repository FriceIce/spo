import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import checkForImages from "../../modules/checkForImages";
import followers from "../../modules/followerCount";
import { RootState } from "../../redux/store";

// hooks
import useFetchArtist from "../../hooks/useFetchArtist";
import { useMediaQuery } from "../../hooks/useMediaQueries";
import useSpotify from "../../hooks/useSpotify";

// components
import AlbumCard from "../../components/AlbumCard";
import ArtistCard from "../../components/ArtistCard";
import GoBackArrow from "../../components/GoBackArrow";
import PlaylistCard from "../../components/PlaylistCard";
import MusicBars from "../../components/Spinner/MusicBars/MusicBars";
import Spinner from "../../components/Spinner/Spinner";
import TracksCard, { trackUris } from "../../components/TracksCard";
import useComponentIsMounted from "../../hooks/useIsMounted";
import { musicStateForGreenPlayButton } from "../../modules/musicState";

export type ShowMoreType = {
  albums: boolean;
  playlists: boolean;
  artists: boolean;
};

const Artist = () => {
  const { activeTrack, paused, shuffle, currentPageID } = useSelector(
    (state: RootState) => state.playback
  );
  const [howManyAlbums, setHowManyAlbums] = useState<number>(4);
  const [bgColorIndex, setBgColor] = useState<string | undefined>(undefined);
  const [showMore] = useState<ShowMoreType>({
    albums: false,
    playlists: false,
    artists: false,
  });

  const dispatch = useDispatch();
  const { spotifyApi } = useSpotify();
  const { id } = useParams();
  const isDesktop = useMediaQuery("1024px");
  // useBgColor("bg-color", "artist-img", [desktop])

  const showMoreAlbums = () => {
    if (howManyAlbums === 4) return setHowManyAlbums(albums.length - 1);
    return setHowManyAlbums(4);
  };

  const {
    artist,
    topTracks,
    albums,
    relatedArtists,
    artistRelatedPlaylists,
    isLoading,
    isSuccess,
    isError,
  } = useFetchArtist(id ?? "");

  useEffect(() => {
    if (!isDesktop) return setHowManyAlbums(4);
    if (isDesktop && albums) return setHowManyAlbums(albums.length - 1);
  }, [isDesktop, albums]);

  useComponentIsMounted(() => {
    const bgColors = ["lightblue", "lightpink"];
    const selectedBgColor = bgColors[Math.floor(Math.random() * 2)];
    console.log(selectedBgColor);
    setBgColor(selectedBgColor);
  }, [id, isDesktop]);

  if (isError)
    return (
      <h1 className="text-center py-6">
        Sorry, we were unable to access this content.
      </h1>
    );

  if (isLoading) return <Spinner />;

  if (isSuccess)
    return (
      <>
        <div
          id={isDesktop ? "bg-color" : undefined}
          className={`absolute inset-0 lg:h-[475px]`}
          style={{ background: isDesktop ? bgColorIndex : "transparent" }}
        ></div>
        <GoBackArrow />

        <div className="space-y-10 pb-4 max-w-[1500px] mx-auto">
          <div
            className={`relative h-[325px] sm:h-[625px] md:h-[725px] lg:h-[425px] flex items-end`}
          >
            <img
              crossOrigin="anonymous"
              src={checkForImages(artist.images)}
              alt=""
              className="absolute inset-0 w-full h-full lg:max-w-[250px] lg:max-h-[250px] size-full object-center object-cover lg:m-10 lg:mr-2 lg:rounded-full shadow"
            />

            {/* This div works as a filter for the artist image. */}
            <div className="absolute inset-0 z-[10] bg-[#00000036] w-full h-full lg:max-w-[250px] lg:max-h-[250px] size-full object-center object-cover lg:m-10 lg:mr-2 lg:rounded-full" />

            {}

            <h1
              className={`relative z-10 brightness-200 ml-4 lg:ml-0 lg:mb-10 m mb-2 text-5xl font-extrabold text-white cursor-pointer hover:underline`}
            >
              <a
                href={artist.external_urls.spotify}
                rel="noreferrer"
                title={artist.external_urls.spotify}
              >
                {artist.name}
              </a>
            </h1>
          </div>

          <section className="relative space-y-4">
            <div className="pl-5 pr-3 space-y-1 mt-5" id="el">
              <p className="text-[13px] lg:text-lg xl:text-xl text-spotify_gray">
                {followers(artist.followers.total)} &#x2022; followers
              </p>

              <div className="flex justify-between gap-6 items-center lg:flex-row-reverse lg:justify-end">
                <div className="flex gap-6 items-center">
                  <img
                    src={checkForImages(topTracks[0].album.images)}
                    alt="top track image"
                    className="h-8 w-6 object-cover object-center border rounded lg:hidden"
                  />
                  <p className="border border-[#888888] p-[6px] h-fit text-xs rounded lg:rounded-2xl lg:px-3 lg:py-2">
                    Follow
                  </p>
                </div>

                <div className="flex items-center gap-3 lg:flex-row-reverse lg:gap-5 lg:mt-2">
                  <button
                    className="bg-transparent outline-none border-none cursor-pointer lg:hidden"
                    onClick={() =>
                      spotifyApi
                        .setShuffle(!shuffle, { uris: trackUris(topTracks) })
                        .then(() =>
                          dispatch({
                            type: "playback/setShuffle",
                            payload: !shuffle,
                          })
                        )
                    }
                  >
                    <img
                      src={
                        shuffle
                          ? "/spotify-web/icons/shuffle-active.svg"
                          : "/spotify-web/icons/shuffle.svg"
                      }
                      alt="shuffle button"
                      className="size-8 lg:size-10"
                    />
                  </button>

                  <button
                    className="rounded-full bg-transparent border-none outline-none w-fit cursor-pointer"
                    onClick={() =>
                      musicStateForGreenPlayButton({
                        spotifyApi,
                        arrayOfTracks: topTracks,
                        trackUris,
                        paused,
                        currentPageID,
                        id,
                        dispatch,
                      })
                    }
                  >
                    <img
                      src={`/spotify-web/icons/${
                        !paused && currentPageID === id
                          ? "pause-button.png"
                          : "play-button.png"
                      }`}
                      alt="play button"
                      className="size-10 md:size-14"
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="mx-4 space-y-1">
              <h2 className="font-extrabold text-lg">Popular songs</h2>
              <ul>
                {topTracks.slice(0, 5).map((track, index) => {
                  return (
                    <li key={track.id} className="flex items-center gap-3">
                      {activeTrack === track.uri && !paused ? (
                        <div className="w-[14px] lg:block group-hover:hidden">
                          <MusicBars />
                        </div>
                      ) : (
                        <div
                          className={`w-[14px] grid place-items-center ${
                            activeTrack === track.uri && "text-spotify_green"
                          }`}
                        >
                          <p className="text-sm">{index + 1}</p>
                        </div>
                      )}
                      <div className="flex-1">
                        <TracksCard
                          card={track}
                          arrayOfTracks={topTracks}
                          index={index}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
          <section className="mx-4 space-y-3">
            <div className="flex justify-between">
              <h2 className="lg:ml-4 font-extrabold text-lg">Albums</h2>

              {showMore.albums && (
                <button className="hidden lg:block text-spotify_gray font-semibold mr-4 outline-none hover:text-white">
                  Show more
                </button>
              )}
            </div>

            <ul
              id="albums"
              className={`${isDesktop ? "slider-grid" : "flex flex-col gap-3"}`}
            >
              {albums.slice(0, howManyAlbums).map((album) => {
                return (
                  <li key={album.id}>
                    <AlbumCard albumData={album} />
                  </li>
                );
              })}
            </ul>

            {!isDesktop && (
              <button
                className=" bg-spotify_green text-black text-xs font-bold shadow py-[6px] px-[8px] rounded-md w-fit cursor-pointer outline-none"
                onClick={showMoreAlbums}
              >
                {howManyAlbums === 4 ? "Show more" : "Show less"}
              </button>
            )}
          </section>
          <section className="lg:mx-4 space-y-4">
            <div className="flex justify-between">
              <h2 className="font-extrabold text-lg pl-5">
                With {artist.name}
              </h2>

              {showMore.playlists && (
                <button className="hidden lg:block text-spotify_gray font-semibold mr-4 outline-none hover:text-white">
                  Show more
                </button>
              )}
            </div>
            <ul
              id="playlists"
              className={`overflow-x-auto overflow-y-hidden no-scrollbar
            ${isDesktop ? "slider-grid" : "flex gap-3"}`}
            >
              {artistRelatedPlaylists.map((playlist, index) => {
                return (
                  <li
                    key={playlist.id}
                    className={`flex-none w-[140px] lg:w-auto
                  ${index === 0 && "ml-5 lg:ml-0"} ${
                      index === artistRelatedPlaylists.length - 1 &&
                      "mr-2 lg:mr-none"
                    }`}
                  >
                    <PlaylistCard playlistData={playlist} />
                  </li>
                );
              })}
            </ul>
          </section>
          <section className="space-y-4 lg:mx-2">
            <div className="flex justify-between">
              <h2 className="font-extrabold text-lg pl-5">Fans also like</h2>

              {showMore.artists && (
                <button className="hidden lg:block text-spotify_gray font-semibold mr-4 outline-none hover:text-white">
                  Show more
                </button>
              )}
            </div>
            <ul
              id="artists"
              className={`overflow-auto no-scrollbar
                ${isDesktop ? "slider-grid" : "flex gap-3 "}`}
            >
              {relatedArtists.map((artist, index) => {
                return (
                  <li
                    key={artist.id}
                    className={`flex-none w-[150px] lg:w-auto
                  ${index === 0 && "ml-5 lg:ml-0"} ${
                      index === relatedArtists.length - 1 && "mr-2"
                    }`}
                  >
                    <ArtistCard card={artist} />
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </>
    );
};

/* 
  ENDPOINTS I NEED TO CREATE THIS PAGE:
  [1] Get artist - Hero image
  [2] Get Artist's Top Tracks  
  [3] Get artist's albums
  [4] Get artist related artists 
*/

export default Artist;
