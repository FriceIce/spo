import { useEffect, useState } from "react";

export const useMediaQuery = (mediaWidth: string) => {
  const [screenWidth, setScreenWidth] = useState<boolean>(
    window.matchMedia(`(min-width: ${mediaWidth})`).matches
  );

  useEffect(() => {
    const matchMedia: MediaQueryList = window.matchMedia(
      `(min-width: ${mediaWidth})`
    );

    // Function to update screenWidth based on matchMedia
    const handleChange = () => {
      setScreenWidth(matchMedia.matches);
    };

    // Call handleChange once to initialize the correct value
    handleChange();

    // Add event listener
    matchMedia.addEventListener("change", handleChange);

    // Remove event listener when the component unmounts
    return () => {
      matchMedia.removeEventListener("change", handleChange);
    };
  }, [mediaWidth]);

  return screenWidth;
};
