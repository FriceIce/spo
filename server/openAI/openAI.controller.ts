import { NextFunction, Request, Response } from "express";
import { getGenresForPrompt } from "../modules/getGenresForPrompt";
import spotifyRecommendations from "../modules/spotifyAPI";

/** 
  @description - fetch the genres with the help from openAI
  @route - GET /api/getGenres/
*/

export const getGenres = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { prompt, access_token }: { prompt: string; access_token: string } =
    req.body;
  console.log(prompt, access_token);

  try {
    const chatResponse = await getGenresForPrompt(prompt);

    if (!chatResponse) {
      return res.status(500).json({ error: "Failed to get genres." });
    }

    req.body = {
      prompt,
      access_token,
      explation: chatResponse.explanation,
      genres: chatResponse.genres,
    };

    next();
  } catch (err) {
    return res.status(500).json({ status: "Failed", message: "server error" });
  }
};

/** 
  @description - return a list of recommendations for given prompt in getGenres function.
  @route - 
*/

export const getRecommendations = async (req: Request, res: Response) => {
  const { explation, genres, prompt, access_token } = req.body;

  try {
    const recommendedTracks = await spotifyRecommendations(
      access_token,
      genres
    );

    if (recommendedTracks?.message !== "successful")
      return res.status(500).json({
        status: "unsuccessful",
        message: recommendedTracks?.message,
      });

    res.status(200).json({
      status: "Success",
      data: {
        prompt: prompt,
        response: {
          explation,
          genres,
          recommendedTracks,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ status: "unsuccessful", message: "server error" });
  }
};
