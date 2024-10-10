import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

const SaveContent = () => {
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  return (
    <>
      <div
        className="relative w-10 h-8 lg:mt-2 cursor-pointer"
        onClick={() => setIsFollowing((prev) => !prev)}
      >
        <CheckCircleIcon
          aria-label="button"
          className={`size-7 lg:size-10 text-spotify_green absolute left-0 bottom-[-2px] 
          ${
            isFollowing ? "opacity-100 rotate-0" : "opacity-0 rotate-[-90deg]"
          } transition-all duration-200 delay-100`}
          /* onClick={() => followPlaylist(String(id), false)} */
        />

        <PlusCircleIcon
          aria-label="button"
          className={`size-7 lg:size-10 absolute left-0 bottom-[-2px] transition-all duration-300 ${
            isFollowing && "opacity-0 rotate-90"
          }`}
          /* onClick={() => followPlaylist(String(id), true)} */
        />
      </div>
    </>
  );
};

export default SaveContent;
