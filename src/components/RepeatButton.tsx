import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSpotify from "../hooks/useSpotify";
import { RootState } from "../redux/store";

const RepeatButton = () => {
  const { repeat } = useSelector((state: RootState) => state.playback);
  const dispatch = useDispatch();
  const { spotifyApi } = useSpotify();

  useEffect(() => {
    console.log(repeat);
    spotifyApi.setRepeat(repeat);
  }, [repeat]);

  const correctIcon = () => {
    return repeat === "off"
      ? "/spotify-web/icons/repeat.svg"
      : repeat === "context"
      ? "/spotify-web/icons/repeat-active.svg"
      : "/spotify-web/icons/repeat-track.svg";
  };

  return (
    <button
      onClick={() => dispatch({ type: "playback/setRepeat", payload: repeat })}
    >
      <img
        src={correctIcon()}
        alt="repeat button"
        className="size-5 object-cover object-center ml-2"
      />
    </button>
  );
};

export default RepeatButton;
