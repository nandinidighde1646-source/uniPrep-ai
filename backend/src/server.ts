
import "dotenv/config";
import app from "./app.js";

console.log("Runtime diagnostic:", {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  databaseUrlPresent: Boolean(process.env.DATABASE_URL),
  databaseUrlLength: process.env.DATABASE_URL?.length ?? 0,
  databaseUrlStartsWithPostgres:
    process.env.DATABASE_URL?.startsWith("postgresql://") ?? false,


renderService: process.env.RENDER_SERVICE_NAME ?? "MISSING",
frontendUrlPresent: Boolean(process.env.FRONTEND_URL),
});
const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
