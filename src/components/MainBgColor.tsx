import { useEffect } from "react";
import { FastAverageColor } from "fast-average-color";
import checkForImages from "../modules/checkForImages";

type Prop = {
  data:
    | SpotifyApi.SinglePlaylistResponse
    | SpotifyApi.SingleAlbumResponse
    | null;
  isLoading: boolean;
};

const MainBgColor = ({ data, isLoading }: Prop) => {
  useEffect(() => {
    if (data && !isLoading) {
      const fac = new FastAverageColor();
      const containerEl = document.getElementById("bg-color") as HTMLDivElement;
      const imgEl = document.getElementById("img") as HTMLImageElement;

      fac
        .getColorAsync(imgEl, { algorithm: "simple", crossOrigin: "anonymous" })
        .then((color) => {
          containerEl.style.backgroundColor = color.hexa;
        })
        .catch((err) => console.log(err));
    }
  }, [data, isLoading]);

  if (data && !isLoading)
    return (
      <div
        className={`absolute w-full h-[420px] md:h-[475px] lg:h-[525px]`}
        id="bg-color"
      >
        <img
          id="img"
          crossOrigin="anonymous" // crossOrigin must come before src attribute, otherwise it will only work on Chrome and not other brwosers.
          src={checkForImages(data.images)}
          alt="background color"
          className="opacity-0 absolute z-[1] w-full h-0 inset-0 object-cover object-center blur-xl"
        />
      </div>
    );
};

export default MainBgColor;
