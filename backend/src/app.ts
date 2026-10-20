import express from "express";
import cors from "cors";
import notesRouter from "./routes/notes.routes.js";
import authRouter from "./routes/auth.routes.js";
import pyqsRouter from "./routes/pyqs.routes.js";
import userRoutes from "./routes/user.routes.js";

import aiRouter from "./routes/ai.routes.js";
import mockTestsRouter from "./routes/mockTests.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://9n4wtmqs-5173.inc1.devtunnels.ms",
  process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));


app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/notes", notesRouter);
app.use("/api/pyqs", pyqsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRoutes);
app.use("/api/ai", aiRouter);
app.use("/api/mock-tests", mockTestsRouter);
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to UniPrep AI API 🚀",
  });
});

app.get("/about", (req, res) => {
  res.json({
    project: "UniPrep AI",
    version: "1.0.0",
    backend: "Node.js + Express",
  });
});

export default app;