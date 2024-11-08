const checkForImages = (
  array: SpotifyApi.ImageObject[],
  imgPlaceholder?: string
) => {
  const sortImages = [
    ...array,
    { url: imgPlaceholder ?? "/spotify-web/icons/no-image.svg" },
  ].sort((a: any, b: any) => a.height - b.height);
  const image = sortImages[sortImages.length > 2 ? 1 : 0].url;
  return image;
};

export default checkForImages;
