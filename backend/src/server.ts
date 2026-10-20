
import "dotenv/config";
import app from "./app.js";
console.log(
  "Database-related environment variable names:",
  Object.keys(process.env).filter((key) =>
    key.toUpperCase().includes("DATABASE")
  )
);
console.log(
  "DATABASE_URL available:",
  Boolean(process.env.DATABASE_URL)
);
const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
