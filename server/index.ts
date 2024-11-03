import express from "express";
import cors from "cors";
import userRoutes from "./user/user.route";
import "dotenv/config";

const app = express();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000;

//routes
app.use("/api", userRoutes);

app.listen(PORT, () => console.log("Listening on port " + PORT));
