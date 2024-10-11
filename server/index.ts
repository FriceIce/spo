import express from "express";
import "dotenv/config";
import openAI from "./openAI/openAI.routes";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3020;

//routes
app.use("/api/", openAI);

app.listen(PORT, () => {
  const responseText =
    "Listening to upbeat and cheerful music can help lift your spirits and improve your mood when you're feeling sad. Here are some genres that can help:\n\nPop\nFunk\nReggae\nDisco\nSka";

  const [explation, genres] = responseText.split(":\n\n");

  console.log(
    explation,
    genres.split("\n").filter((genre) => genre !== "")
  );
});
