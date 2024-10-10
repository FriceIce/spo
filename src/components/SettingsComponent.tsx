import { useState } from "react";

const SettingsComponent = ({
  external_source_to_spotify,
}: {
  external_source_to_spotify: string;
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div className="relative h-[30px]">
      <div
        className={`absolute left-[-120px] px-4 py-2 rounded font-bold bg-[#282828] opacity-0 transition-all shadow duration-300 lg:hover:bg-spotify_green lg:hover:text-black
      ${
        showModal
          ? "top-full opacity-100 pointer-events-auto"
          : "top-0 pointer-events-none"
      }`}
      >
        <a
          href={external_source_to_spotify}
          rel="noreferrer"
          title={external_source_to_spotify}
        >
          <p className="text-nowrap text-xs">PLAY ON SPOTIFY</p>
        </a>
      </div>

      <div
        className="flex h-full flex-col justify-center gap-1 md:opacity-0 md:flex-row md:items-center group-hover:opacity-100"
        onClick={() => setShowModal((prev) => !prev)}
      >
        <div className="rounded-full size-[3px] bg-spotify_gray"></div>
        <div className="rounded-full size-[3px] bg-spotify_gray"></div>
        <div className="rounded-full size-[3px] bg-spotify_gray"></div>
      </div>
    </div>
  );
};

export default SettingsComponent;
