import { HomeIcon, PlusIcon } from "@heroicons/react/16/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Square3Stack3DIcon } from "@heroicons/react/24/outline";
import YourLibraryList from "./YourLibraryList";

const Sidebar = () => {
  return (
    <div className="relative h-full lg:p-2 flex-col gap-2 text-white lg:w-[25%] lg:max-w-[350px] lg:flex lg:static">
      <div className="fixed bottom-0 bg-[#121212] h-[90px] w-full rounded flex lg:static lg:flex-col justify-around lg:h-[10%]">
        <div className="flex-1 lg:flex-none flex flex-col justify-center items-center lg:items-start lg:w-max lg:flex-row lg:pl-6 gap-2 lg:gap-4 cursor-pointer">
          <HomeIcon className="size-6 lg:size-7 text-gray-400 hover:text-white" />
          <p className="text-xs lg:text-base lg:font-semibold lg:self-center">
            Home
          </p>
        </div>
        <div className="flex-1 lg:flex-none flex flex-col justify-center items-center lg:items-start lg:w-max lg:flex-row lg:pl-6 gap-2 lg:gap-4 cursor-pointer">
          <MagnifyingGlassIcon className="size-6 lg:size-7 text-gray-400 hover:text-white" />
          <p className="text-xs lg:text-base lg:font-semibold">Search</p>
        </div>
        <div className="flex-1 lg:flex-none flex flex-col justify-center items-center gap-2 cursor-pointer lg:hidden">
          <Square3Stack3DIcon className="size-6 lg:size-7 text-gray-400 hover:text-white" />
          <p className="text-xs lg:text-base lg:font-semibold">Your library </p>
        </div>
      </div>

      <div className="hidden flex-none h-[90%] lg:flex flex-col gap-4 bg-spotify_black rounded pl-6 pr-2 py-4 overflow-y-auto">
        <div className="flex-1 lg:flex-none flex items-center justify-between lg:gap-4 cursor-pointer">
          <div className="flex gap-4">
            <Square3Stack3DIcon className="size-6 lg:size-7 text-gray-400 hover:text-white cursor-pointer" />
            <p className="text-xs lg:text-base lg:font-semibold">
              Your library
            </p>
          </div>
          <PlusIcon className="size-6 text-gray-400 hover:text-white cursor-pointer" />
        </div>
        <YourLibraryList />
      </div>
    </div>
  );
};

export default Sidebar;
