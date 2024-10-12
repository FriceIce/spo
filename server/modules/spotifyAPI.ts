import SpotifyApi from "spotify-web-api-node";
import "dotenv/config";

const spotifyRecommendations = (access_token: string, genres: string[]) => {
  //configuration
  const spotifyApi = new SpotifyApi({
    clientId: process.env.ClientID,
    clientSecret: process.env.ClientSecret,
    redirectUri: "http://localhost:5173/spotify-web/callback",
  });

  spotifyApi.setAccessToken(access_token);

  // fetch the recommendations
  const recommendations = spotifyApi
    .getRecommendations({
      seed_genres: genres.join(","),
      min_popularity: 50,
      limit: 25,
    })
    .then((recommendations) => {
      console.log("Tracks:", recommendations);

      if (!recommendations) {
        return null;
      }

      return { message: "successful", tracks: recommendations.body.tracks };
    })
    .catch((err) => {
      if (err instanceof Error) {
        console.log(err);
        return { message: err.message };
      }
    });

  return recommendations;
};

export default spotifyRecommendations;
