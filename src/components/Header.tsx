import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { useMediaQuery } from "../hooks/useMediaQueries";
import { RootState } from "../redux/store";

const Header = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const desktop = useMediaQuery("1024px");

  return (
    <header
      className={`bg-spotify_black sticky inset-0 z-20 w-full h-[65px] lg:h-auto lg:p-6 rounded-t flex 
      ${
        desktop ? "justify-between" : "flex-row-reverse justify-end gap-2"
      } items-center px-6`}
    >
      <p className="px-4 py-[6px] rounded-3xl text-xs lg:text-base bg-spotify_green font-bold text-black w-fit">
        Music
      </p>

      <div className="flex items-center gap-3 h-fit cursor-pointer">
        {desktop && (
          <a
            href="https://open.spotify.com/download"
            rel="noreferrer"
            className=" h-fit px-4 py-[8px] bg-[#000000a1] flex items-center gap-1 rounded-2xl hover:scale-105"
          >
            <ArrowDownCircleIcon className="size-5 text-white cursor-pointer" />
            <p className="text-sm text-white font-bold">Install app</p>
          </a>
        )}

        <div
          className={`size-7 lg:size-8 bg-black rounded-full cursor-not-allowed`}
        >
          <img
            src={
              user?.images
                ? user.images[0].url
                : "/spotify-web/icons/no-profile-pic.svg"
            }
            alt="profile picture"
            className="size-8 object-contain rounded-full"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
