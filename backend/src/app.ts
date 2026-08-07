import express from "express";
import cors from "cors";
import notesRouter from "./routes/notes.routes.js";
import authRouter from "./routes/auth.routes.js";
import pyqsRouter from "./routes/pyqs.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);


app.use(express.json());

app.use("/api/notes", notesRouter);
app.use("/api/pyqs", pyqsRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", userRoutes);
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