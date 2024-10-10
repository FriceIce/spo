import { useDispatch } from "react-redux";
import useSpotify from "../hooks/useSpotify";

const ShuffleButton = ({
  shuffle,
  uris,
}: {
  shuffle: boolean;
  uris: string[];
}) => {
  const dispatch = useDispatch();
  const { spotifyApi } = useSpotify();

  const shufflePlaylist = () => {
    spotifyApi.setShuffle(!shuffle, { uris });
    dispatch({ type: "playback/setShuffle", payload: !shuffle });
  };

  return (
    <button className="" onClick={shufflePlaylist}>
      <img
        src={`/spotify-web/icons/${shuffle ? "shuffle-active" : "shuffle"}.svg`}
        className="size-5 object-cover object-center"
      ></img>
    </button>
  );
};

export default ShuffleButton;
