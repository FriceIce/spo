import { PlusIcon } from "@heroicons/react/16/solid";

import { useState } from "react";
import { useMediaQuery } from "../hooks/useMediaQueries";

// components
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { sidebarIcons } from "../assets/icon_paths";
import { RootState } from "../redux/store";
import YourLibraryList from "./UserLibraryList";

const Sidebar = () => {
  const active_path = useSelector((state: RootState) => state.user.active_path);
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);

  const dispatch = useDispatch();
  const desktop = useMediaQuery("1024px");

  const resetSearchResults = (): void => {
    dispatch({ type: "search/topResult", payload: null });
    dispatch({ type: "search/searchResults", payload: [] });
  };

  // These variables use boolean values to determine whether their respective icons should be displayed in white or gray.
  const homeIcon = active_path === "home";
  const searchIcon = active_path === "search";
  const libraryIcon = active_path === "library";

  return (
    <>
      {!desktop ? (
        <div className="fixed bottom-0 z-10 bg-[#000000ec] h-[70px] w-screen rounded flex lg:static lg:flex-col justify-around lg:h-[10%]">
          <NavLink
            to="/spotify-web/"
            className="flex-1 lg:flex-none flex flex-col justify-center items-center lg:items-start lg:w-max lg:flex-row lg:pl-6 gap-2 lg:gap-4 cursor-pointer"
            onClick={resetSearchResults}
          >
            <img
              src={homeIcon ? sidebarIcons.home_active : sidebarIcons.home}
              className={`size-6 lg:size-7 lg:hover:text-white`}
            />
            <p
              className={`text-xs font-bold lg:text-base lg:self-center ${
                !homeIcon && "text-spotify_gray"
              }`}
            >
              Home
            </p>
          </NavLink>
          <NavLink
            to="/spotify-web/search"
            className="flex-1 lg:flex-none flex flex-col justify-center items-center lg:items-start lg:w-max lg:flex-row lg:pl-6 gap-2 lg:gap-4 cursor-pointer"
          >
            <img
              src={
                searchIcon ? sidebarIcons.search_active : sidebarIcons.search
              }
              className={`size-6 lg:size-7 lg:hover:text-white`}
            />
            <p
              className={`text-xs lg:text-base font-bold ${
                !searchIcon && "text-spotify_gray"
              }`}
            >
              Search
            </p>
          </NavLink>
          <NavLink
            to="/spotify-web/user-library"
            className="flex-1 lg:flex-none flex flex-col justify-center items-center gap-2 cursor-pointer lg:hidden"
          >
            <img
              src={
                libraryIcon ? sidebarIcons.library_active : sidebarIcons.library
              }
              className={`size-6 lg:size-7 lg:hover:text-white`}
            />
            <p
              className={`text-xs text-spot lg:text-base font-bold ${
                !libraryIcon && "text-spotify_gray"
              }`}
            >
              Your library{" "}
            </p>
          </NavLink>
        </div>
      ) : (
        <div
          className={`h-full lg:pr-2 flex-col gap-2 text-white ${
            openSidebar && "flex-1"
          } lg:w-[${
            openSidebar ? "25%" : "0px"
          }] lg:max-w-[350px] lg:flex lg:static`}
        >
          <div className="fixed bottom-0 bg-[#121212] h-[90px] w-full rounded flex lg:static lg:flex-col justify-around lg:h-[10%] lg:min-h-[105px] lg:gap-2 pr-4">
            <NavLink to="/spotify-web/" className={"pl-2"}>
              <div
                className="flex-1 lg:flex-none flex flex-col justify-center items-center lg:items-start lg:w-max lg:flex-row lg:pl-8 gap-2 lg:gap-4 cursor-pointer"
                onClick={resetSearchResults}
              >
                <img
                  src={homeIcon ? sidebarIcons.home_active : sidebarIcons.home}
                  className={`size-6 lg:size-7 hover:text-white`}
                />
                {openSidebar && (
                  <p
                    className={`text-xs lg:text-base lg:font-semibold lg:self-center ${
                      !homeIcon && "text-spotify_gray"
                    }`}
                  >
                    Home
                  </p>
                )}
              </div>
            </NavLink>
            <NavLink to="/spotify-web/search" className={"pl-2"}>
              <div className="flex-1 lg:flex-none flex flex-col justify-center items-center lg:items-start lg:w-max lg:flex-row lg:pl-8 gap-2 lg:gap-4 cursor-pointer">
                <img
                  src={
                    searchIcon
                      ? sidebarIcons.search_active_lg
                      : sidebarIcons.search_lg
                  }
                  className={`size-6 lg:size-7 hover:text-white`}
                />
                {openSidebar && (
                  <p
                    className={`text-xs lg:text-base lg:font-semibold ${
                      !searchIcon && "text-spotify_gray"
                    }`}
                  >
                    Search
                  </p>
                )}
              </div>
            </NavLink>
            <div className="flex-1 lg:flex-none flex flex-col justify-center items-center gap-2 cursor-pointer lg:hidden">
              <img
                src={
                  libraryIcon
                    ? sidebarIcons.library_active
                    : sidebarIcons.library
                }
                className="size-6 lg:size-7 text-gray-400 hover:text-white"
              />
              <p
                className={`text-xs lg:text-base lg:font-semibold ${
                  !libraryIcon && "text-spotify_gray"
                }`}
              >
                Your library{" "}
              </p>
            </div>
          </div>

          <div className="hidden flex-none h-[90%] lg:flex flex-col gap-4 bg-spotify_black rounded px-6 py-4 overflow-y-auto no-scrollbar">
            <div className="flex-1 lg:flex-none flex items-center justify-between lg:gap-4 cursor-pointer">
              <div
                className="flex gap-4 justify-center pl-4"
                onClick={() => setOpenSidebar((prev) => !prev)}
              >
                <img
                  src={
                    libraryIcon
                      ? sidebarIcons.library_active
                      : sidebarIcons.library
                  }
                  className="size-6 lg:size-7 text-gray-400 hover:text-white cursor-pointer"
                />
                {openSidebar && (
                  <p className="text-xs lg:text-base lg:font-semibold">
                    Your library
                  </p>
                )}
              </div>
              {openSidebar && (
                <PlusIcon className="size-6 text-gray-400 hover:text-white cursor-not-allowed" />
              )}
            </div>
            <YourLibraryList openSidebar={openSidebar} />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
