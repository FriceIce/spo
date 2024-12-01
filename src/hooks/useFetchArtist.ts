import { useQueries, useQueryClient } from "@tanstack/react-query";
import useSpotify from "./useSpotify";

const useFetchArtist = (id: string) => {
  const { spotifyApi } = useSpotify();

  const queryClient = useQueryClient();
  const currentArtist = queryClient.getQueryData([
    "Artist-" + id,
  ]) as SpotifyApi.SingleArtistResponse;
  const tracks = queryClient.getQueryData([
    "ArtistTopTracks-" + id,
  ]) as SpotifyApi.TrackObjectFull[];
  const artistAlbums = queryClient.getQueryData([
    "ArtistAlbums-" + id,
  ]) as SpotifyApi.AlbumObjectSimplified[];
  const artistRelPlaylists = queryClient.getQueryData([
    "ArtistRelatedPlaylists-" + id,
  ]) as SpotifyApi.PlaylistObjectSimplified[];

  const queries = useQueries({
    queries: [
      {
        enabled: !currentArtist,
        initialData: currentArtist,
        queryKey: ["Artist-" + id],
        queryFn: async () =>
          spotifyApi.getArtist(id ?? "").then((result) => {
            return result;
          }),
      },
      {
        enabled: !tracks,
        initialData: tracks,
        queryKey: ["ArtistTopTracks-" + id],
        queryFn: async () =>
          spotifyApi.getArtistTopTracks(id ?? "", "ES").then((result) => {
            return result.tracks;
          }),
      },
      {
        enabled: !artistAlbums,
        initialData: artistAlbums,
        queryKey: ["ArtistAlbums-" + id],
        queryFn: async () =>
          spotifyApi
            .getArtistAlbums(id ?? "", { market: "ES" })
            .then((result) => {
              return result.items;
            }),
      },
      {
        enabled: !artistRelPlaylists,
        initialData: artistRelPlaylists,
        queryKey: ["ArtistRelatedPlaylists-" + id],
        queryFn: async () =>
          spotifyApi
            .getArtist(id ?? "")
            .then((result) => {
              return result;
            })
            .then((result) => {
              const query = result.name;
              return spotifyApi
                .searchPlaylists(query, {
                  type: "playlist",
                  market: "ES",
                  limit: 10,
                })
                .then((result) => {
                  return result.playlists.items.filter((playlist) => playlist);
                  // const owner = "spotify";
                  // const onlySpotifyPlaylists = result.playlists.items.filter(
                  //   (playlist) =>
                  //     playlist.owner.display_name?.toLocaleLowerCase() === owner
                  // );
                  // return onlySpotifyPlaylists;
                });
            }),
      },
    ],
  });

  const artist = queries[0].data as SpotifyApi.SingleArtistResponse;
  const topTracks = queries[1].data as SpotifyApi.TrackObjectFull[];
  const albums = queries[2].data as SpotifyApi.AlbumObjectSimplified[];
  const artistRelatedPlaylists = queries[3]
    .data as SpotifyApi.PlaylistObjectSimplified[];

  const isLoading = queries.find((query) => query.isLoading);
  const isSuccess = queries.find((query) => query.isSuccess);
  const isError = queries.find((query) => query.isError);

  return {
    artist,
    topTracks,
    albums,
    artistRelatedPlaylists,
    isLoading,
    isSuccess,
    isError,
  };
};

export default useFetchArtist;
