import axios from "axios";
import "dotenv/config";
import { Request, Response } from "express";

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

type Token = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

/** 
  @description Create guest login
  @route POST /api/guestLogin/
*/

export const guestLogin = async (req: Request, res: Response) => {
  console.log("running guest login");

  try {
    const authOptions = {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    const form = new URLSearchParams();
    form.append("grant_type", "client_credentials"); // append() takes property name and value

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      form,
      authOptions
    );

    if (!response.data) {
      return res
        .status(response.status || 500)
        .json({ message: response.statusText || "No data received" });
    }

    // The client expects a response with the response.data content directly in the json object.
    return res.status(response.status).json({ ...response.data });
  } catch (err) {
    const status = err.response?.status || 500;
    const message =
      err.response?.statusText || err.message || "An error occurred";

    return res.status(status).json({ message });
  }
};

export const login = async (req: Request, res: Response) => {
  // The client is expected to send the query string needed to login in with the body
  const query: string = req.body.query;

  try {
    const response = await axios.post<Token>(
      `https://accounts.spotify.com/api/token`,
      query,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(client_id + ":" + client_secret).toString("base64"),
        },
      }
    );

    const data = response.data;

    if (!data) {
      return res.status(response.status).json({ message: response.statusText });
    }

    return res.status(response.status).json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
    });
  } catch (err) {
    const status = err.response?.status || 500;
    const message =
      err.response?.statusText || err.message || "An error occurred";

    return res.status(status).json({ message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken: string = req.body.refresh_token;

  try {
    const reqBody = {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: client_id as string,
    };

    const reqHeader = {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
    };

    const response = await axios.post<Token>(
      "https://accounts.spotify.com/api/token",
      reqBody,
      reqHeader
    );

    const data = response.data;

    if (!data) {
      return res.status(response.status).json({ message: response.statusText });
    }

    // If everything is successful, send the response to the client
    return res.status(response.status).json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
    });
  } catch (err) {
    const status = err.response?.status || 500;
    const message =
      err.response?.statusText || err.message || "An error occurred";
    return res.status(status).json({ message });
  }
};
