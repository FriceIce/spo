// modules
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { convertMilliseconds } from "../../modules/convertMS";
import { RootState } from "../../redux/store";

// components
import { ClockIcon, HashtagIcon } from "@heroicons/react/24/outline";
import SettingsComponent from "../../components/SettingsComponent";
import MusicBars from "../../components/Spinner/MusicBars/MusicBars";
import Spinner from "../../components/Spinner/Spinner";

// other
import parse from "html-react-parser";
import { useParams } from "react-router";
import GoBackArrow from "../../components/GoBackArrow";
import MainBgColor from "../../components/MainBgColor";
import SaveContent from "../../components/SaveContent";
import { Artist } from "../../definition";
import useSpotify from "../../hooks/useSpotify";
import checkForImages from "../../modules/checkForImages";
import followers from "../../modules/followerCount";

const SpecificPlaylist = () => {
  const guest = useSelector((state: RootState) => state.user.guest);
  const { activeTrack, paused, shuffle, currentPageID } = useSelector(
    (state: RootState) => state.playback
  );
  const [_, setShuffle] = useState<boolean>(shuffle);
  const [playlistOwnerImg, setPlaylistOwnerImg] = useState<string>("");

  const { spotifyApi } = useSpotify();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["album - " + id],
    queryFn: () =>
      spotifyApi
        .getPlaylist(id ?? "", { market: "ES" })
        .then(
          (result) => {
            return result;
          },
          (error) => {
            console.error(error);

            return null;
          }
        )
        .then((playlist) => {
          const userID = playlist ? playlist.owner.id : "";

          return spotifyApi.getUser(userID).then((user) => {
            const sortImages = Array.isArray(user.images)
              ? [...user.images].sort(
                  (a: any, b: any) => a.height - b.height
                )[0].url
              : "";
            setPlaylistOwnerImg(sortImages);

            return playlist;
          });
        }),
  });

  useEffect(() => {
    if (data && shuffle)
      spotifyApi.setShuffle(shuffle, { uris: playlistUris(data) });
  }, [shuffle, data, isLoading]);

  const playlistUris = (array: SpotifyApi.SinglePlaylistResponse) =>
    array.tracks.items.map((track) => track.track.uri);

  if (isLoading) return <Spinner />;
  if (isError)
    return (
      <h1 className="text-center py-6">
        Sorry, we were unable to access this content.
      </h1>
    );

  if (data && isSuccess && data)
    return (
      <>
        <MainBgColor data={data} isLoading={isLoading} />
        <div className="lg:hidden">
          <GoBackArrow />
        </div>

        <div className="relative z-[2] flex flex-col md:gap-8 mt-10">
          <section className="space-y-4 lg:space-y-10 px-6 pt-6">
            <div className="mx-auto w-[220px] h-[220px] md:h-auto md:w-auto rounded flex gap-5 items-end ">
              <img
                src={checkForImages(data.images)}
                alt="Thumbnail"
                className="w-[220px] h-[220px] rounded shadow"
              />

              <div className="space-y-2 hidden md:block">
                <p className="capitalize text-base font-medium">{data.type}</p>

                <a
                  href={data.external_urls.spotify}
                  target="_blank"
                  rel="noopener"
                  title={data.external_urls.spotify}
                >
                  <h1 className="font-bold md:text-5xl lg:hover:underline">
                    {data.name}
                  </h1>
                </a>

                <p className="text-spotify_gray text-sm">
                  {parse(data.description ? data.description : "")}
                </p>

                <div className="flex gap-1 text-sm w-max font-medium">
                  <img
                    src={playlistOwnerImg}
                    alt=""
                    width={24}
                    height={24}
                    className={`${
                      playlistOwnerImg ? "block" : "hidden"
                    } hidden size-6 lg:block object-contain rounded-full`}
                  />

                  <a
                    title={data.owner.external_urls.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    href={data.owner.external_urls.spotify}
                    className="hover:underline cursor-pointer text-white"
                  >
                    <p className="font-bold cursor-pointer">
                      {data.owner.display_name}
                    </p>
                  </a>

                  <p className="">
                    &#x2022; {followers(data.followers.total)} followers{" "}
                    {/* {playlist.release_date.split("-")[0]} */}
                  </p>

                  <p className="">&#x2022; {data.tracks.total} songs</p>
                </div>
              </div>
            </div>
            <div className="flex-3 flex flex-col gap-2 lg:hidden">
              <a href={data.external_urls.spotify} rel="norefferer">
                <h1 className="md:hidden font-bold text-xl sm:text-4xl">
                  {data.name}
                </h1>
              </a>

              {data.description && (
                <p className="text-spotify_gray text-xs sm:text-sm">
                  {parse(data.description ? data.description : "")}
                </p>
              )}

              <div className="flex items-center gap-1 w-max">
                <img
                  src={playlistOwnerImg}
                  alt=""
                  width={20}
                  height={20}
                  className={`${
                    playlistOwnerImg ? "block" : "hidden"
                  } size-5 lg:hidden object-contain rounded-full`}
                />

                <a href={data.owner.external_urls.spotify} rel="noreferrer">
                  <p className="font-bold text-sm cursor-pointer">
                    {data.owner.display_name}
                  </p>
                </a>

                <p className="capitalize text-sm md:hidden">
                  &#x2022; {followers(data.followers.total)} followers
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center gap-4 lg:justify-end lg:flex-row-reverse">
              <div className="flex gap-2">
                <img
                  src={checkForImages(data.images)}
                  alt="Album cover"
                  className="h-8 w-7 object-cover object-center border-2 rounded md:hidden"
                />

                <SaveContent />
              </div>

              <div className="flex items-center gap-3 lg:flex-row-reverse lg:gap-5">
                <button
                  className="bg-transparent outline-none border-none cursor-pointer"
                  onClick={() => {
                    if (guest) return;
                    setShuffle((prev) => !prev);
                    dispatch({
                      type: "playback/setShuffle",
                      payload: !shuffle,
                    });
                  }}
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
                  onClick={() => {
                    if (guest) return;
                    if (id === currentPageID && paused) spotifyApi.play();
                    if (id === currentPageID && !paused) spotifyApi.pause();
                    if (id !== currentPageID) {
                      dispatch({
                        type: "playback/setMultipleUris",
                        payload: { uris: playlistUris(data), pageID: id },
                      });
                    }
                  }}
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
          </section>
          <section className="flex-1 space-y-4 px-6 pb-6">
            <div className="hidden justify-between text-spotify_gray border-b border-b-[#4e4e4eb2] pb-2 px-4  md:flex">
              <div className="flex gap-3 items-center">
                <HashtagIcon className="size-4" />
                <h2 className="">Titel</h2>
              </div>
              <ClockIcon className="size-5 hidden md:block mr-7" />
            </div>
            <ul className="">
              {data.tracks.items.map((track: any, index) => {
                if (!track.track) return null;

                const uri: string = track.track.uri;
                const imageList = track.track.album.images;
                const albumCover = checkForImages(
                  imageList,
                  "/spotify-web/icons/album-placeholder.svg"
                );
                return (
                  <li
                    key={track.track.id}
                    className="group flex justify-between items-center lg:hover:bg-[#7979797c] rounded md:transition-all md:px-4 py-2 cursor-pointer"
                  >
                    <div
                      className="flex gap-3 items-center w-[90%]"
                      onClick={() => {
                        if (guest) return;
                        if (activeTrack !== uri)
                          dispatch({
                            type: "playback/setUri",
                            payload: {
                              uris: playlistUris(data),
                              offset: index,
                            },
                          });
                        if (!paused && activeTrack === track.uri)
                          spotifyApi.pause();
                        if (paused && activeTrack === track.uri)
                          spotifyApi.play();
                      }}
                    >
                      {activeTrack === uri && !paused && (
                        <div className="hidden size-8 lg:block group-hover:hidden">
                          <MusicBars />
                        </div>
                      )}

                      <div
                        className={`hidden text-white size-8
                        ${
                          activeTrack === uri && !paused
                            ? "lg:group-hover:flex items-center"
                            : "group-hover:hidden"
                        }
                        ${activeTrack === uri && paused && "hidden"}`}
                      >
                        <img
                          src="/spotify-web/icons/mini-pause-button.svg"
                          className={`size-5`}
                          onClick={() => spotifyApi.pause()}
                        />
                      </div>

                      <div
                        className={`text-white size-8 hidden
                          ${
                            (activeTrack !== uri || paused) &&
                            "lg:group-hover:flex items-center"
                          }`}
                      >
                        <img
                          src="/spotify-web/icons/mini-play-button.svg"
                          className="size-5"
                          onClick={() => spotifyApi.play()}
                        />
                      </div>

                      <p
                        className={`hidden text-base xl:text-lg mb-1 size-8 lg:group-hover:hidden
                        ${
                          (activeTrack !== uri || paused) &&
                          "lg:flex items-center"
                        }
                        ${
                          activeTrack === uri
                            ? "text-spotify_green"
                            : "text-spotify_gray"
                        }`}
                      >
                        {index + 1}
                      </p>

                      <img
                        src={albumCover}
                        alt="Album cover"
                        className="size-[50px] lg:size-[60px] object-cover object-center rounded-[2px] lg:rounded"
                      />
                      <div className="w-[100%] overflow-hidden">
                        <h3
                          className={`font-semibold lg:text-lg truncate 
                          ${activeTrack === uri && "text-spotify_green"}`}
                        >
                          {track.track.name}
                        </h3>

                        <div className="flex items-center gap-1">
                          {track.track.explicit && (
                            <img
                              src="/spotify-web/icons/explicit-symbol.png"
                              alt=""
                              className="size-4"
                            />
                          )}

                          <p className="text-sm text-spotify_gray  lg:group-hover:text-white truncate">
                            {track.track.artists.map((artist: Artist) => {
                              const comma =
                                track.track.artists[
                                  track.track.artists.length - 1
                                ].name === artist.name
                                  ? ""
                                  : ", ";
                              return artist.name + comma;
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center">
                      <div className="text-spotify_gray text-sm hidden md:block">
                        {convertMilliseconds(
                          data.tracks.items[index].track.duration_ms
                        )}
                      </div>
                      <SettingsComponent
                        external_source_to_spotify={
                          track.track.external_urls.spotify
                        }
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </>
    );
};

export default SpecificPlaylist;
