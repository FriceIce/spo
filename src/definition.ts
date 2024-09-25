import { Dispatch } from "react";
import { ShowMoreType } from "./pages/Artist/Artist";

export type Album = {
  id: string;
  images: Images[];
  name: string; // name of the album
  artists: Artist[];
  release_date: string;
  type: "album";
  tracks: Tracks;
};

export type Images = {
  url: string;
  height: number;
  width: number;
};

export type Artist = {
  id: string;
  uri: string;
  name: string;
  href: string;
  external_urls: {
    spotify: string;
  };
  images: Images[];
  type: string;
};

// Remove this type
export type Tracks = {
  total: number;
  items: ArtistInTrack[];
};

export type ArtistInTrack = {
  id: string;
  uri: string;
  name: string;
  track_number: number;
  duration_ms: number;
  explicit: boolean;
  type: string;
  artists: { id: string; uri: string; name: string }[];
  track: Track;
  popularity: number;
};

export type Track = {
  id: string;
  artists: ArtistInTrack[];
};

// Playlist
export type Playlist = {
  id: string;
  name: string;
  description: string;
  type: "playlist";
  followers: { total: number };
  images: Images[];
  owner: PlaylistOwner;
  tracks: { total: number; items: [{ track: PlaylistSingleTrack }] };
};

export type PlaylistSingleTrack = {
  album: {
    name: string; // album name
    artist: ArtistInTrack[];
    external_urls: { spotify: string };
    images: Images[];
  };
  name: string; // name of the track
  artists: ArtistInTrack[];
  duration_ms: number;
  explicit: boolean;
  external_urls: { spotify: string };
};

export type PlaylistOwner = {
  id: string;
  external_urls: { spotify: string };
  type: string;
  uri: string;
  display_name: string;
};

export type SearchTracks = {
  id: string;
  uri: string;
  type: "track";
  name: string;
  duration_ms: number;
  explixit: boolean;
  artists: { id: string; uri: string; name: string }[];
  album: { images: Images[] };
};

export type Combined = Album | Playlist;

export type TopResult =
  | (Album & { type: "album" })
  | (Playlist & { type: "playlist" })
  | (SearchTracks & { type: "track" })
  | (Artist & { type: "artist" });

export type CombinedJsonSearch =
  | (Album & { type: "album" })
  | (Playlist & { type: "playlist" })
  | (Artist & { type: "artist" })
  | (SearchTracks & { type: "track" });

export type CombinedSpotifySearch =
  | (Album & { type: "album" })
  | (Playlist & { type: "playlist" })
  | (Artist & { type: "artist" })
  | (SearchTracks & { type: "track" });

// Search
export type Category = "artist" | "album" | "playlist" | "track";

export type SpotifyAuthResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
};

export type elementIDs = ["artists", "albums", "playlists"];
export type ShowMoreContentProp = {
  showMore: ShowMoreType;
  elementIDs: elementIDs;
  setShowMore: Dispatch<React.SetStateAction<ShowMoreType>>;
};
