import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authentication.js";
import userRoutes from "./routes/users.js";
import { connectDB } from "./db/takaWaveDB.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  optionSuccessStatus: 200,
};

// middlewares
app.use(cors(corsOptions));
app.use(express.json());

// routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.get("/", async (req, res) => {
  res.send("Taka Server is Running!");
});

const run = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`Taka Server is Running on Port: ${port}`);
  });
};

run().catch(console.dir);
