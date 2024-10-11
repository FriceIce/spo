import { NextFunction, Request, Response } from "express";
import { getGenresForPrompt } from "../modules/getGenresForPrompt";

/** 
  @description - fetch the genres with the help from openAI
  @route - GET /api/getGenres/
*/

export const getGenres = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prompt: string = req.body.prompt;
  console.log(prompt);

  try {
    const chatResponse = await getGenresForPrompt(prompt);

    if (!chatResponse) {
      return res.status(500).json({ error: "Failed to get genres." });
    }

    req.body = {
      prompt: prompt,
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
  const { explation, genres, prompt } = req.body;

  res.status(200).json({
    status: "Success",
    data: {
      prompt: prompt,
      response: {
        explation,
        genres,
      },
    },
  });
};
