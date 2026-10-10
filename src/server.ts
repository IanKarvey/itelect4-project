import "dotenv/config";          // MUST be the first line
import { app } from "./app";
import { connectDB } from "./config/db";

const PORT = Number(process.env.PORT) || 4000;

// Connect FIRST, then listen, so no request arrives before the DB is ready.
connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`API on http://localhost:${PORT}`),
    );
  })
  .catch((err: unknown) => {
    console.error("Could not start:", err);
    process.exit(1);
  });
