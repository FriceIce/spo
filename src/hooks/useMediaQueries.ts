import { useEffect, useState } from "react";

export const useMediaQuery = (mediaWidth: string) => {
  const [screenWidth, setScreenWidth] = useState<boolean>(
    window.matchMedia(mediaWidth).matches
  );

  const matchMedia: MediaQueryList = window.matchMedia(
    `(min-width: ${mediaWidth})`
  );

  useEffect(() => {
    //This will return a value without needing to use the event listener. This action will only run once.
    setScreenWidth(matchMedia.matches);

    matchMedia.addEventListener("change", () => {
      setScreenWidth(matchMedia.matches);
    });

    return () => matchMedia.removeEventListener("change", () => {});
  }, []);

  return screenWidth;
};
