import { useState } from "react";
import { useSelector } from "react-redux";
import AlbumCard from "../../components/AlbumCard";
import ArtistCard from "../../components/ArtistCard";
import PlaylistCard from "../../components/PlaylistCard";
import ShowMoreContent from "../../components/ShowMoreContent";
import Spinner from "../../components/Spinner/Spinner";
import TracksCard from "../../components/TracksCard";
import { Artist } from "../../definition";
import useFetchHome from "../../hooks/useFetchHome";
import { useMediaQuery } from "../../hooks/useMediaQueries";
import { RootState } from "../../redux/store";
import setActivePath from "../../hooks/setActivePath";
import Header from "../../components/Header";

const Home = () => {
  const topArtists = useSelector((state: RootState) => state.home.topArtists);
  const [showMoreTitle, setShowMoreTitle] = useState<string>("");
  const [showMore, setShowMore] = useState<
    null | "artist" | "track" | "playlist" | "album" | "recommendations"
  >(null);
  const isDesktop = useMediaQuery("1024px");
  setActivePath("home");

  const {
    recentlyPlayed,
    featuredPlaylists,
    newReleases,
    recommendations,
    isLoading,
    isSuccess,
  } = useFetchHome();

  if (isLoading) return <Spinner />;

  if (showMore && isDesktop)
    return (
      <ShowMoreContent
        contentType={[
          recentlyPlayed,
          recommendations,
          featuredPlaylists,
          newReleases,
          topArtists,
        ]}
        title={showMoreTitle}
        type={showMore}
        setShowMore={setShowMore}
        recommendations={recommendations}
      />
    );

  const showMoreFunc = (
    type: "track" | "playlist" | "album" | "artist" | "recommendations",
    title: string
  ) => {
    setShowMore(type);
    setShowMoreTitle(title);
  };

  if (isSuccess && showMore === null)
    return (
      <>
        <Header />
        <div className="mt-2 space-y-8 lg:space-y-14 pb-[30px] lg:pb-[20px] overflow-hidden no-scrollbar">
          <section
            className={`flex-1 text-white space-y-2 max-w-[2200px] ${
              featuredPlaylists.length === 0 && "hidden"
            }`}
          >
            <div className="flex justify-between">
              <h1 className="text-lg lg:text-2xl font-bold pl-4">
                Music to keep an eye on
              </h1>

              <button
                className="hidden text-spotify_gray hover:text-white cursor-pointer lg:block mr-7"
                onClick={() => showMoreFunc("playlist", "Featured playlists")}
              >
                Show more
              </button>
            </div>

            <ul
              className={`${
                isDesktop ? "slider-grid" : "flex overflow-auto no-scrollbar"
              }`}
            >
              {featuredPlaylists.map((playlist, index) => {
                return (
                  <li
                    key={playlist.id}
                    className={`flex-none max-w-[150px] lg:max-h-none lg:max-w-none
                  ${
                    index === 0
                      ? "ml-2"
                      : index === featuredPlaylists.length - 1 && "mr-2"
                  }`}
                  >
                    <PlaylistCard playlistData={playlist} homepage />
                  </li>
                );
              })}
            </ul>
          </section>

          <section
            className={`flex-1 text-white space-y-2 max-w-[2200px] ${
              newReleases.length === 0 && "hidden"
            }`}
          >
            <div className="flex justify-between">
              <h1 className="text-lg lg:text-2xl font-bold pl-4">
                New releases
              </h1>

              <button
                className="hidden text-spotify_gray hover:text-white cursor-pointer lg:block mr-7"
                onClick={() => showMoreFunc("album", "New releases")}
              >
                Show more
              </button>
            </div>

            <ul
              className={`${
                isDesktop ? "slider-grid" : "flex overflow-auto no-scrollbar"
              }`}
            >
              {newReleases.map((album, index) => {
                return (
                  <li
                    key={index}
                    className={`flex-none max-w-[150px] lg:max-h-none lg:max-w-none
                  ${
                    index === 0
                      ? "ml-2"
                      : index === newReleases.length - 1 && "mr-2"
                  }`}
                  >
                    <AlbumCard albumData={album} isHomepage />
                  </li>
                );
              })}
            </ul>
          </section>

          <section
            className={`flex-1 text-white space-y-2 max-w-[2200px] ${
              recommendations.length === 0 && "hidden"
            }`}
          >
            <div className="flex justify-between">
              <h1 className="text-lg lg:text-2xl font-bold px-4">
                Recommendations
              </h1>

              <button
                className="hidden text-spotify_gray hover:text-white cursor-pointer lg:block mr-7"
                onClick={() =>
                  showMoreFunc("recommendations", "Recommendations")
                }
              >
                Show more
              </button>
            </div>

            <ul
              className={`${
                isDesktop ? "slider-grid" : "flex overflow-auto no-scrollbar"
              }`}
            >
              {recommendations.map((track, index) => {
                return (
                  <li
                    key={index}
                    className={`flex-none max-w-[150px] lg:max-h-none lg:max-w-none 
                  ${
                    index === 0
                      ? "ml-2"
                      : index === recommendations.length - 1 && "mr-2"
                  }`}
                  >
                    <TracksCard
                      card={track}
                      homepage
                      arrayOfTracks={recommendations}
                      index={index}
                    />
                  </li>
                );
              })}
            </ul>
          </section>

          <section
            className={`flex-1 text-white space-y-2 max-w-[2200px] ${
              topArtists.length === 0 && "hidden"
            }`}
          >
            <div className="flex justify-between">
              <h1 className="text-lg lg:text-2xl font-bold px-4">
                Your top artists
              </h1>

              <button
                className="hidden text-spotify_gray hover:text-white cursor-pointer lg:block mr-7"
                onClick={() => showMoreFunc("artist", "Your top artists")}
              >
                Show more
              </button>
            </div>

            <ul
              className={`${
                isDesktop
                  ? "slider-grid"
                  : "flex overflow-auto no-scrollbar gap-2"
              }`}
            >
              {topArtists.map((track, index) => {
                return (
                  <li
                    key={index}
                    className={`flex-none ${
                      index === 0 && "ml-2 lg:ml-0"
                    } lg:max-h-none lg:max-w-none`}
                  >
                    <ArtistCard card={track as Artist} homepage />
                  </li>
                );
              })}
            </ul>
          </section>

          <section
            className={`flex-1 text-white space-y-2 max-w-[2200px] ${
              recentlyPlayed.length === 0 && "hidden"
            }`}
          >
            <div className="flex justify-between">
              <h1 className="text-lg lg:text-2xl font-bold px-4">
                Recently played tracks
              </h1>

              <button
                className="hidden text-spotify_gray hover:text-white cursor-pointer lg:block mr-7"
                onClick={() => showMoreFunc("track", "Recently played tracks")}
              >
                Show more
              </button>
            </div>

            <ul
              className={`${
                isDesktop ? "slider-grid" : "flex overflow-auto no-scrollbar"
              }`}
            >
              {recentlyPlayed.map((track, index) => {
                return (
                  <li
                    key={index}
                    className={`flex-none max-w-[150px] lg:max-h-none lg:max-w-none
                  ${
                    index === 0
                      ? "ml-2"
                      : index === recentlyPlayed.length - 1 && "mr-2"
                  }`}
                  >
                    <TracksCard
                      card={track}
                      homepage
                      arrayOfTracks={recentlyPlayed}
                      index={index}
                    />
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </>
    );
};

export default Home;
