const Authentication = () => {
  const mobile_localhost = import.meta.env.VITE_AUTH_URL_MOBILE;
  const desktop_host = import.meta.env.VITE_AUTH_URL_HOSTING;
  const desktop_localhost = import.meta.env.VITE_AUTH_URL_DESKTOP;
  const device_hostname = window.location.hostname;

  const current_user_device =
    device_hostname === "localhost"
      ? desktop_localhost
      : device_hostname === "friceice.github.io"
      ? desktop_host
      : mobile_localhost;

  const authentication_url = current_user_device as string;

  return (
    <div className="bg-spotify_black h-screen pt-40 px-2">
      <div className="flex flex-col items-center justify-center gap-3 lg:gap-6">
        <div className="flex gap-2 lg:gap-4 items-center mx-auto">
          <h1 className="font-bold text-xl text-balance text-center sm:text-2xl md:text-3xl lg:text-5xl transition-all duratiion-200">
            Welcome to my{" "}
            <span className="text-spotify_green">Spotify project</span>
          </h1>

          <img
            src="/spotify-web/icons/spotify-logo.svg"
            alt=""
            className="size-6 lg:size-10"
          />
        </div>

        <div className="space-y-2 items-center flex-col flex justify-center">
          <a
            href={authentication_url}
            className="bg-spotify_green text-black text-xs lg:text-base font-bold px-6 py-[8px] lg:px-20 lg:py-[12px] rounded-full lg:hover:scale-105 lg:hover:bg-[#60ff98] transition-all"
          >
            <button>Sign in</button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
