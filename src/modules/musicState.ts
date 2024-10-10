import SpotifyWebApi from "spotify-web-api-js";
import { SearchTracks } from "../definition";
import { AppDispatch } from "../redux/store";

type Prop = {
  track: SpotifyApi.TrackObjectFull | SearchTracks;
  arrayOfTracks: SpotifyApi.TrackObjectFull[] | SearchTracks[];
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
  dispatch: AppDispatch;
  trackUris: (
    arrayOfTracks: SpotifyApi.TrackObjectFull[] | SearchTracks[]
  ) => string[];
  paused: boolean;
  index: number;
  activeTrack: string | null;
};

export const musicStateForTrack = ({
  track,
  arrayOfTracks,
  index,
  spotifyApi,
  dispatch,
  trackUris,
  paused,
  activeTrack,
}: Prop) => {
  if (activeTrack !== track.uri)
    dispatch({
      type: "playback/setUri",
      payload: { uris: trackUris(arrayOfTracks), offset: index },
    });

  // Checks the current state of the track the user clicked on before pausing or playing
  if (!paused && activeTrack === track.uri) spotifyApi.pause();
  if (paused && activeTrack === track.uri) spotifyApi.play();
};

type GreenPlayButtonProp = {
  id: string | undefined;
  spotifyApi: SpotifyWebApi.SpotifyWebApiJs;
  currentPageID: string;
  paused: boolean;
  dispatch: AppDispatch;
  arrayOfTracks: SpotifyApi.TrackObjectFull[] | SearchTracks[];
  trackUris: (
    arrayOfTracks: SpotifyApi.TrackObjectFull[] | SearchTracks[]
  ) => string[];
};

// Checks for the current state of the Green Play button.

export const musicStateForGreenPlayButton = ({
  id,
  spotifyApi,
  currentPageID,
  paused,
  dispatch,
  arrayOfTracks,
  trackUris,
}: GreenPlayButtonProp) => {
  if (id === currentPageID && paused) spotifyApi.play(); //Example: The user preses the Green Play button on playlist page
  if (id === currentPageID && !paused) spotifyApi.pause(); //Example: The user preses the Green Pause button on playlist page

  // Example: The user preses the Green Play button on another page with different id.
  if (id !== currentPageID) {
    dispatch({
      type: "playback/setMultipleUris",
      payload: { uris: trackUris(arrayOfTracks), pageID: id },
    });
  }
};
