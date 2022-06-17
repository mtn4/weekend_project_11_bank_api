import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { rootRouter } from "./routes/index.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/", rootRouter);
app.all("*", (req, res) => {
  res.send({ error: "No Path Found" });
});
app.listen(process.env.PORT, (error) => {
  if (error) console.error("Error: ", error);
  console.log("SERVER IS UP AND RUNNING ON PORT ", process.env.PORT);
});
