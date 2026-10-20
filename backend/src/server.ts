
import "dotenv/config";
import app from "./app.js";

console.log("Runtime diagnostic:", {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  databaseUrlPresent: Boolean(process.env.DATABASE_URL),
  databaseUrlLength: process.env.DATABASE_URL?.length ?? 0,
  databaseUrlStartsWithPostgres:
    process.env.DATABASE_URL?.startsWith("postgresql://") ?? false,
});
const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
