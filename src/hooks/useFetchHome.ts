import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import useSpotify from "./useSpotify";
import { Album, Playlist, SearchTracks } from "../definition";

const useFetchHome = () => {
  const dispatch = useDispatch();
  const { spotifyApi } = useSpotify();
  // Checking for cached items for faster upload time.
  const queryClient = useQueryClient();
  const recent = queryClient.getQueryData(["Recently played"]);
  const feature = queryClient.getQueryData([
    "Featured playlists",
  ]) as SpotifyApi.PlaylistObjectSimplified[];
  const newFeat = queryClient.getQueryData([
    "New releases",
  ]) as SpotifyApi.AlbumObjectSimplified[];
  const recom = queryClient.getQueryData([
    "Recommendations",
  ]) as unknown as SpotifyApi.TrackObjectSimplified[];

  const queries = useQueries({
    queries: [
      {
        enabled: !recent,
        initialData: recent,
        queryKey: ["Recently played"],
        queryFn: async () =>
          new Promise((resolve) => {
            const ms = 1693557043508; // 2023-09-01
            spotifyApi.getMyRecentlyPlayedTracks({ after: ms }).then(
              (tracks) => {
                resolve(tracks.items.map((item) => item.track));
              },
              (err) => console.log(err)
            );
          }),
      },
      {
        enabled: !feature,
        initialData: feature,
        queryKey: ["Featured playlists"],
        queryFn: async () =>
          new Promise((resolve) => {
            spotifyApi.getFeaturedPlaylists({ limit: 25 }).then((item) => {
              resolve(item.playlists.items);
            });
          }),
      },
      {
        enabled: !newFeat,
        initialData: newFeat,
        queryKey: ["New releases"],
        queryFn: async () =>
          new Promise((resolve) => {
            spotifyApi.getNewReleases({ limit: 25 }).then((releases) => {
              resolve(releases.albums.items);
            });
          }),
      },
      {
        enabled: !recom,
        initialData: recom,
        queryKey: ["Recommendations"],
        queryFn: async () =>
          spotifyApi
            .getMyTopArtists({ time_range: "short_term" })
            .then((results) => {
              return results.items;
            })
            .then((artistData) => {
              const genres = artistData.map((artist) => artist.genres); //output - string[][]
              const seed_genres = genres
                .flat()
                .filter((genre, index, self) => self.indexOf(genre) === index);
              const formattedMusicGenres = seed_genres
                .slice(0, 5)
                .join(",")
                .replace(/(\b\s\b)/g, "-");

              return spotifyApi
                .getRecommendations({
                  seed_genres: formattedMusicGenres,
                })
                .then((results) => {
                  dispatch({ type: "home/setTopArtists", payload: artistData });
                  return results.tracks;
                });
            }),
      },
    ],
  });

  const recentlyPlayed = queries[0].data as SearchTracks[];
  const featuredPlaylists = queries[1].data as Playlist[];
  const newReleases = queries[2].data as Album[];
  const recommendations = queries[3].data as unknown as SearchTracks[];

  const isLoading = queries.find((query) => query.isLoading);
  const isSuccess = queries.find((query) => query.isSuccess);

  return {
    recentlyPlayed,
    featuredPlaylists,
    newReleases,
    recommendations,
    isLoading,
    isSuccess,
  };
};

export default useFetchHome;
