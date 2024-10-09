// *
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { convertMilliseconds } from "../../modules/convertMS";
import { RootState } from "../../redux/store";

// icons
import { ClockIcon, HashtagIcon } from "@heroicons/react/24/outline";

// Components
import ConvertToMilisec from "../../components/ConvertToMilisec";
import GoBackArrow from "../../components/GoBackArrow";
import MainBgColor from "../../components/MainBgColor";
import MusicBars from "../../components/Spinner/MusicBars/MusicBars";
import Spinner from "../../components/Spinner/Spinner";
import useSpotify from "../../hooks/useSpotify";
import checkForImages from "../../modules/checkForImages";
import SettingsComponent from "../../components/SettingsComponent";
import SaveContent from "../../components/SaveContent";

const SpecificAlbum = () => {
  const [artistImg, setArtistImg] = useState<string>("");
  const [shuffle, setShuffle] = useState(false);
  const { activeTrack, paused, currentPageID } = useSelector(
    (state: RootState) => state.playback
  );
  const dispatch = useDispatch();
  const { id } = useParams();
  const { spotifyApi } = useSpotify();

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ["album - " + id],
    queryFn: () =>
      spotifyApi
        .getAlbum(id ?? "", { market: "ES" })
        .then(
          (result) => {
            return result;
          },
          (error) => {
            console.error(error);
            return null;
          }
        )
        .then((album) => {
          const artist = album?.artists[0];
          const artistID = artist ? artist.id : "";

          return spotifyApi.getArtist(artistID).then((artist) => {
            const sortImages = [
              ...artist.images,
              { url: "/spotify-web/icons/no-profile-pic.svg" },
            ].sort((a: any, b: any) => a.height - b.height);
            const image = sortImages[sortImages.length > 2 ? 1 : 0].url;
            setArtistImg(image);
            return album;
          });
        }),
  });

  useEffect(() => {
    if (data && shuffle)
      spotifyApi.setShuffle(shuffle, { uris: albumsTrackUris(data) });
  }, [shuffle, data]);
  const albumsTrackUris = (array: SpotifyApi.SingleAlbumResponse) =>
    array.tracks.items.map((track) => track.uri);

  if (isLoading) return <Spinner />;
  if (isError)
    return (
      <h1 className="text-center py-6">
        Sorry, we were unable to access this content.
      </h1>
    );
  if (isSuccess && data)
    return (
      <>
        <MainBgColor data={data} isLoading={isLoading} />
        <div className="lg:hidden">
          <GoBackArrow />
        </div>

        <div className="relative z-[2] flex flex-col md:gap-8 p-6 mt-10">
          <section className="space-y-4 lg:space-y-10">
            <div className=" mx-auto w-[220px] h-[220px] md:h-auto md:w-auto rounded flex gap-5 items-end ">
              <img
                src={checkForImages(data.images)}
                alt="Thumbnail"
                className="w-[220px] h-[220px] rounded shadow"
              />
              <div className="space-y-2 hidden md:block">
                <p className="capitalize text-base font-medium">{data.type}</p>

                <a
                  href={data.external_urls.spotify}
                  rel="noreferrer"
                  title={data.external_urls.spotify}
                >
                  <h1 className="font-bold md:text-5xl">{data.name}</h1>
                </a>

                <div className="flex gap-1 text-sm w-max font-medium">
                  <img
                    src={artistImg}
                    alt=""
                    width={24}
                    height={24}
                    className={`${
                      artistImg ? "block" : "hidden"
                    } hidden size-6 lg:block object-contain rounded-full`}
                  />

                  <a
                    title={data.external_urls.spotify}
                    target="_blank"
                    rel="noopener"
                    href={data.artists[0].external_urls.spotify}
                    className="hover:underline cursor-pointer text-white"
                  >
                    <p className="font-bold cursor-pointer">
                      {data.artists[0].name}
                    </p>
                  </a>

                  <p className="capitalize md:hidden">
                    {data.type} &#x2022; {data.release_date.split("-")[0]}
                  </p>

                  <p className="capitalize">
                    &#x2022; {data.tracks.total} songs,{" "}
                    {convertMilliseconds(
                      data.tracks.items
                        .map((track) => track.duration_ms)
                        .reduce((acc, currValue) => acc + currValue, 0),
                      true
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-3 flex flex-col gap-3 md:hidden">
              <a
                href={data.external_urls.spotify}
                rel="noreferrer"
                title={data.external_urls.spotify}
              >
                <h1 className="md:hidden font-bold text-xl sm:text-4xl">
                  {data.name}
                </h1>
              </a>
              <div className="flex flex-col gap-1 w-max">
                <div className="flex gap-1">
                  <img
                    src={artistImg}
                    alt=""
                    width={20}
                    height={20}
                    className={`${
                      artistImg ? "block" : "hidden"
                    } size-5 lg:hidden object-contain rounded-full`}
                  />
                  <a href={data.artists[0].external_urls.spotify}>
                    <p className="font-bold text-sm cursor-pointer">
                      {data.artists[0].name}
                    </p>
                  </a>
                </div>

                <p className="text-gray-300 capitalize text-sm">
                  {data.type} &#x2022; {data.release_date.split("-")[0]}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-3">
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
                  onClick={() => setShuffle((prev) => !prev)}
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
                    if (id === currentPageID && paused) spotifyApi.play();
                    if (id === currentPageID && !paused) spotifyApi.pause();
                    if (id !== currentPageID) {
                      dispatch({
                        type: "playback/setMultipleUris",
                        payload: { uris: albumsTrackUris(data), pageID: id },
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
          <section className="flex-1 space-y-4">
            <div className="hidden justify-between text-spotify_gray border-b border-b-[#4e4e4eb2] pb-2 px-4 md:flex">
              <div className="flex gap-3 items-center">
                <HashtagIcon className="size-4" />
                <h2 className="">Titel</h2>
              </div>
              <ClockIcon className="size-5 hidden md:block mr-7" />
            </div>
            <ul className="">
              {data.tracks.items.map((track, index) => {
                const uri = track.uri;
                return (
                  <li
                    key={track.id}
                    className="group flex justify-between items-center lg:hover:bg-[#7979797c] rounded md:transition-all md:px-4 py-2 cursor-pointer"
                  >
                    <div
                      className="flex gap-3 items-center w-[90%]"
                      onClick={() => {
                        if (activeTrack !== uri)
                          dispatch({
                            type: "playback/setUri",
                            payload: {
                              uris: albumsTrackUris(data),
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
                        className={`text-white size-8 hidden ${
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
                        className={`hidden text-lg mb-1 size-8 lg:group-hover:hidden ${
                          (activeTrack !== uri || paused) &&
                          "lg:flex items-center"
                        } ${
                          activeTrack === uri
                            ? "text-spotify_green"
                            : "text-spotify_gray"
                        }`}
                      >
                        {index + 1}
                      </p>

                      <div className="w-[100%] overflow-hidden">
                        <h3
                          className={`font-semibold lg:text-lg truncate ${
                            activeTrack === uri && "text-spotify_green"
                          }`}
                        >
                          {track.name}
                        </h3>

                        <div className="flex gap-1 items-center">
                          {track.explicit && (
                            <img
                              src="/spotify-web/icons/explicit-symbol.png"
                              alt=""
                              className="size-4"
                            />
                          )}

                          <p className="text-sm text-spotify_gray group-hover:text-white truncate">
                            {track.artists.map((artist) => {
                              const comma =
                                track.artists[track.artists.length - 1].name ===
                                artist.name
                                  ? ""
                                  : ", ";
                              return artist.name + comma;
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center">
                      <ConvertToMilisec
                        value={data.tracks.items[index].duration_ms}
                      />
                      <div className="h-5 flex items-center">
                        <SettingsComponent
                          external_source_to_spotify={
                            track.external_urls.spotify
                          }
                        />
                      </div>
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

export default SpecificAlbum;
