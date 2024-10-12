import express from "express";
import "dotenv/config";
import openAI from "./openAI/openAI.routes";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3020;

//routes
app.use("/api/", openAI);

app.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
