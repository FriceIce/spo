import { useEffect, useState } from "react";

const useImagePreloader = (imgUrls: string[]) => {
  const [loaded, setloaded] = useState<boolean>(false);

  useEffect(() => {
    let isCancelled = false;

    const loadImages = async () => {
      const promises = imgUrls.map((url) => {
        return new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = () => resolve();
          img.onerror = () => reject();
        });
      });

      await Promise.allSettled(promises); //allSettled take a value that is <void>[] and wont throw error if an img wont be loaded.

      if (isCancelled) {
        return setloaded(true);
      }
    };

    loadImages();

    return () => {
      isCancelled = true;
    };
  }, [imgUrls]);

  return loaded; // return true when everything is loaded and false otherwise.
};

export default useImagePreloader;
