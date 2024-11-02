import { ArrowLeftIcon } from "@heroicons/react/16/solid";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router";

// spotify api
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AlbumCard from "../../components/AlbumCard";
import ArtistCard from "../../components/ArtistCard";
import PlaylistCard from "../../components/PlaylistCard";
import TopResultComponent from "../../components/TopResultComponent";
import TracksCard from "../../components/TracksCard";
import { useMediaQuery } from "../../hooks/useMediaQueries";
import useNav from "../../hooks/useNav";
import useSpotify from "../../hooks/useSpotify";
import { AppDispatch, RootState } from "../../redux/store";
import SpotifyWebApi from "spotify-web-api-js";
import { SearchTracks } from "../../definition";
import useActivePath from "../../hooks/useActivePath";

const Search = () => {
  const [input, setInput] = useState<string>("");
  const [active, setActiveCategory] = useState<null | number>(null); // active stands for active category
  const [showMore, setShowMore] = useState<boolean>(false);

  const { spotifyApi } = useSpotify();
  const { topResult, searchResults } = useSelector(
    (state: RootState) => state.search
  );
  const dispatch = useDispatch();
  useActivePath("search");

  const isDesktop = useMediaQuery("1024px");
  const navigate = useNavigate();
  const nextPath = useNav();

  const categories: string[] = ["Tracks", "Artists", "Album", "Playlists"];
  const listOfTracks = searchResults.filter(
    (item) => item.type === "track"
  ) as SearchTracks[];

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (active === null) searchAll(input, dispatch, isDesktop, spotifyApi);
    if (active === 0)
      searchCategory("tracks", input, dispatch, isDesktop, spotifyApi);
    if (active == 1)
      searchCategory("artist", input, dispatch, isDesktop, spotifyApi);
    if (active == 2)
      searchCategory("album", input, dispatch, isDesktop, spotifyApi);
    if (active == 3)
      searchCategory("playlist", input, dispatch, isDesktop, spotifyApi);
  };

  useEffect(() => {
    if (input === "" || (!showMore && !isDesktop)) return;

    // If the user selects a category and the input is not empty then fetch.
    if (active === null) searchAll(input, dispatch, isDesktop, spotifyApi);
    if (active === 0)
      searchCategory("tracks", input, dispatch, isDesktop, spotifyApi);
    if (active == 1)
      searchCategory("artist", input, dispatch, isDesktop, spotifyApi);
    if (active == 2)
      searchCategory("album", input, dispatch, isDesktop, spotifyApi);
    if (active == 3)
      searchCategory("playlist", input, dispatch, isDesktop, spotifyApi);
  }, [active, showMore]);

  return (
    <div className="overflow-x-clip pb-4">
      <form
        className="bg-[#242424] flex items-center gap-1 h-[65px] p-4"
        onSubmit={onSubmit}
      >
        <div className="">
          <ArrowLeftIcon
            className="text-white size-6"
            onClick={() => navigate(-1)}
          />
        </div>
        <input
          disabled={active !== null ? true : undefined}
          type="text"
          className="bg-transparent px-2 flex-1 h-[45px] text-sm outline-none placeholder:text-spotify_gray"
          placeholder="What do you want to listen to?"
          onChange={(e) => setInput(e.target.value)}
        />
      </form>
      <section className="p-4 space-y-5 relative">
        <div className="flex items-center gap-3">
          {active !== null && (
            <div
              className="top-[23px] size-7 rounded-full bg-[#242424] grid place-items-center"
              onClick={() => setActiveCategory(null)}
            >
              <XMarkIcon className="text-white size-5" />
            </div>
          )}
          <ul className={`flex gap-2 sm:mx-0 overflow-x-auto no-scrollbar`}>
            {categories.map((category, index) => {
              return (
                <li
                  key={index}
                  onClick={() => {
                    setShowMore(false);
                    setActiveCategory(index);
                  }}
                  className={`flex-none px-3 py-1 rounded-2xl transition-all duration-200 cursor-pointer 
                  ${
                    active === index
                      ? "bg-spotify_green text-black"
                      : active === null
                      ? "bg-[#242424]"
                      : "hidden"
                  }`}
                >
                  <p>{category}</p>
                </li>
              );
            })}
          </ul>
        </div>
        {(isDesktop === false || active !== null) && (
          <div className="space-y-4">
            {/* <h1 className="text-xl font-bold">Search history</h1> */}

            {topResult &&
              !isDesktop &&
              active === null &&
              topResult.type === "artist" && (
                <div className="border-b border-spotify_gray pb-3">
                  <ArtistCard card={topResult} />
                </div>
              )}

            <ul
              className={`${
                !isDesktop
                  ? "flex flex-col gap-4"
                  : active === 0
                  ? "flex flex-col gap-1"
                  : "card-layout gap-y-4"
              } w-full`}
            >
              {searchResults.map((card, index: number) => {
                if (
                  (card.type === "track" && active === null) ||
                  (card.type === "track" && active === 0)
                )
                  return (
                    <li key={index} className="">
                      <TracksCard
                        card={card}
                        arrayOfTracks={listOfTracks}
                        index={index}
                      />
                    </li>
                  );

                if (
                  (card.type === "artist" && active === null) ||
                  (card.type === "artist" && active === 1)
                )
                  return (
                    <li key={index}>
                      <ArtistCard card={card} />
                    </li>
                  );

                if (
                  (card.type === "playlist" && active === null) ||
                  (card.type === "playlist" && active === 3)
                )
                  return (
                    <li key={index}>
                      <PlaylistCard playlistData={card} />
                    </li>
                  );

                if (
                  (card.type === "album" && active === null) ||
                  (card.type === "album" && active === 2)
                )
                  return (
                    <li key={index}>
                      <AlbumCard albumData={card} />
                    </li>
                  );
              })}
            </ul>
            {!isDesktop && active !== null && !showMore && (
              <div
                className="flex items-center gap-1 cursor-pointer w-max"
                onClick={() => setShowMore(true)}
              >
                <PlusIcon className="size-4 text-spotify_gray" />

                {/* {showMore && <MinusIcon className="size-4 text-spotify_gray"/spotify-web/>} */}
                <p className="text-spotify_gray text-sm lg:text-base">
                  Show more
                </p>
              </div>
            )}
          </div>
        )}

        {topResult && isDesktop && active === null && (
          <TopResultComponent
            nextPath={nextPath}
            topResult={topResult}
            searchResults={searchResults}
            desktop={isDesktop}
          />
        )}
      </section>
    </div>
  );
};

export default Search;

const clearAllDuplicates = (array: any[]) => {
  const uniqueSet = new Set(array.map((item: any) => item.id));
  const uniqueList = array.filter((item: any) => uniqueSet.has(item.id));
  console.log(uniqueList);
  return uniqueList;
};

type SearchCategory = "tracks" | "artist" | "album" | "playlist";
const searchCategory = async (
  category: SearchCategory,
  query: string,
  dispatch: AppDispatch,
  desktop: boolean,
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs
) => {
  if (category === "tracks")
    return await spotifyApi
      .searchTracks(query, {
        limit: 10,
        offset: desktop ? 11 : 6,
        market: "ES",
      })
      .then(
        (results) => {
          // Return the tracks of the first playlist
          console.log(results.tracks.items);
          return dispatch({
            type: "search/specificCategory",
            payload: clearAllDuplicates(results.tracks.items),
          });
        },
        (err) => {
          console.error(err);
          alert("Could'nt find tracks for search term: " + query);
          return [];
        }
      );

  if (category === "artist")
    return await spotifyApi
      .searchArtists(query, {
        limit: 10,
        offset: desktop ? 11 : 6,
        market: "ES",
      })
      .then(
        (results) => {
          return dispatch({
            type: "search/specificCategory",
            payload: clearAllDuplicates(results.artists.items),
          });
        },
        (err) => {
          console.error(err);
          alert("Could'nt find artist for search term: " + query);
          return [];
        }
      );

  if (category === "album")
    return await spotifyApi
      .searchAlbums(query, {
        limit: 10,
        offset: desktop ? 11 : 6,
        market: "ES",
      })
      .then(
        (results) => {
          return dispatch({
            type: "search/specificCategory",
            payload: clearAllDuplicates(results.albums.items),
          });
        },
        (err) => {
          console.error(err);
          alert("Could'nt find album for search term: " + query);
          return [];
        }
      );

  if (category === "playlist")
    return await spotifyApi
      .searchPlaylists(query, {
        limit: 10,
        offset: desktop ? 11 : 6,
        market: "ES",
      })
      .then(
        (results) => {
          return dispatch({
            type: "search/specificCategory",
            payload: clearAllDuplicates(results.playlists.items),
          });
        },
        (err) => {
          console.error(err);
          alert("Could'nt find playlist for search term: " + query);
          return [];
        }
      );
};

const searchAll = async (
  input: string,
  dispatch: AppDispatch,
  desktop: boolean,
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs
) => {
  const playlist = await spotifyApi
    .searchPlaylists(input, { limit: desktop ? 10 : 5, market: "es" })
    .then(
      function (data) {
        const spotifyPlaylists: SpotifyApi.PlaylistObjectSimplified[] = [];

        const playlistWithoutSpotify = data.playlists.items
          .map((playlistItem) => {
            if (
              playlistItem.owner.display_name?.toLocaleLowerCase() === "spotify"
            )
              spotifyPlaylists.push(playlistItem);
            return playlistItem;
          })
          .filter(
            (playlistItem: any) =>
              playlistItem.owner.display_name?.toLocaleLowerCase() !== "spotify"
          );

        const sortedList = [...spotifyPlaylists, ...playlistWithoutSpotify];
        // console.log("Search Playlist", sortedList);
        return [...sortedList];
      },
      function (err) {
        console.error(err);
        return [];
      }
    );

  const artist = await spotifyApi
    .searchArtists(input, { limit: desktop ? 10 : 5, market: "es" })
    .then(
      (results) => {
        const artistList = results.artists.items;
        const topArtist = results.artists.items
          .filter(
            (artist) =>
              artist.name.toLocaleLowerCase() ===
              input.toLocaleLowerCase().trim()
          )
          .sort((a: any, b: any) => b.popularity - a.popularity)[0]; // This will be the top artist that spotify recommend.
        // console.log("Artists", artistList, topArtist);

        const sortArtistByPopularity = artistList.sort(
          (a: any, b: any) => b.popularity - a.popularity
        ); // Sort rest of the list.
        return { searchResults: sortArtistByPopularity, topArtist } as any;
      },
      (err) => {
        console.log(err);
        return [];
      }
    );

  const tracks = await spotifyApi
    .searchTracks(input, { limit: desktop ? 15 : 5, market: "es" })
    .then(
      function (data) {
        // console.log("Search Tracks", input, data.tracks.items);
        const albumNames: string[] = [];
        const albums = data.tracks.items
          .filter((track) => {
            if (albumNames.includes(track.album.name)) return false;
            albumNames.push(track.album.name);
            return true;
          })
          .map((track) => track.album);

        const topAlbum = data.tracks.items.filter(
          (track) =>
            track.album.name.toLowerCase().trim() ===
            input.toLocaleLowerCase().trim()
        )[0];
        const topSong = data.tracks.items.filter(
          (track) =>
            track.name.toLowerCase().trim() === input.toLowerCase().trim()
        )[0];

        // console.log('Top song:', topSong, 'Top artist:', topArtist, 'Top Album:', topAlbum);
        return {
          searchResults: [...data.tracks.items, ...albums],
          topResult: [topSong, topAlbum && topAlbum.album],
          topPlaylist: null,
        } as any;
      },
      function (err) {
        console.error(err);
        return [];
      }
    );

  tracks.topResult = [...tracks.topResult, artist.topArtist, playlist[0]];
  tracks.topPlaylist = playlist[0];

  // sorting top search results by popularity.
  tracks.topResult = tracks.topResult
    .filter((item: any) => item !== undefined)
    .sort((a: any, b: any) => {
      const popularityA = a.popularity ?? -Infinity; // If undefined, changes to -Infinity
      const popularityB = b.popularity ?? -Infinity; // If undefined, changes to -Infinity
      return popularityB - popularityA; // Sort in descending order, meaning albums at the bottom because they dont have popularity property.
    });

  // console.log(tracks.topResult);

  dispatch({ type: "search/topResult", payload: tracks.topResult[0] });
  dispatch({
    type: "search/searchResults",
    payload: [...tracks.searchResults, ...artist.searchResults, ...playlist],
  });
};
