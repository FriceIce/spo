import { songs } from "../assets/library";

const YourLibraryList = () => {
  return (
    <ul className="flex flex-col gap-4">
      {songs.map((song) => {
        return (
          <li className="flex gap-2 text-xs">
            <div className="size-12 rounded">
              <img
                src={song.thumbnail}
                alt="thumbnail"
                className="w-full h-full rounded"
              />
            </div>
            <div className="space-y-2">
              <p>{song.title}</p>
              <p className="text-gray-400">By {song.artist}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default YourLibraryList;
