import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Album, SearchTracks } from "../definition";
import { RootState } from "../redux/store";
import useImagePreloader from "./useImagePreloader";
import useSpotify from "./useSpotify";

const useFetchHome = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [imgUrls, setImgUrls] = useState<string[]>([]);
  const { spotifyApi } = useSpotify();
  const imageLoaded = useImagePreloader(imgUrls);

  // Checking for cached items for faster upload time.
  const queryClient = useQueryClient();
  const recent = queryClient.getQueryData(["Recently played"]);
  const userLib = queryClient.getQueryData([
    "User library",
  ]) as SpotifyApi.PlaylistObjectSimplified[];
  const newFeat = queryClient.getQueryData([
    "New releases",
  ]) as SpotifyApi.AlbumObjectSimplified[];
  const topUserArtists = queryClient.getQueryData([
    "Top artists",
  ]) as unknown as SpotifyApi.ArtistObjectFull[];

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
        enabled: !topUserArtists,
        initialData: topUserArtists,
        queryKey: ["Top Artists"],
        queryFn: async () =>
          spotifyApi
            .getMyTopArtists({ time_range: "short_term" })
            .then((results) => {
              return results.items;
            }),
      },
      {
        enabled: !userLib,
        initialData: userLib,
        queryKey: ["user libraryList"],
        queryFn: async () =>
          await spotifyApi.getUserPlaylists(user?.id).then((playlist) => {
            return playlist.items;
          }),
      },
    ],
  });

  const recentlyPlayed = queries[0].data as SearchTracks[];
  const newReleases = queries[1].data as Album[];
  const topArtists = queries[2].data;
  const userLibrary = queries[3].data;

  useEffect(() => {
    if (recentlyPlayed) {
      const recentUrls = recentlyPlayed.flatMap((track) =>
        track.album.images.map((img) => img.url)
      );
      setImgUrls((prev) => [...prev, ...recentUrls]);
    }

    if (newReleases) {
      const newRelUrls = newReleases.flatMap((album) =>
        album.images.map((img) => img.url)
      );
      setImgUrls((prev) => [...prev, ...newRelUrls]);
    }
  }, []);

  // Returning the success and loading state.
  const isLoading = queries.find((query) => query.isLoading);
  const isSuccess = queries.find((query) => query.isSuccess);

  return {
    recentlyPlayed,
    newReleases,
    topArtists,
    userLibrary,
    isLoading,
    isSuccess,
    imageLoaded,
  };
};

export default useFetchHome;
