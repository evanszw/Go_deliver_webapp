import app from "./app";
import { prisma } from "./lib/prisma";
import { PORT } from "./config";

async function main() {
  try {
    await prisma.$connect();
    console.log("[Go Deliver] Database connected");
  } catch (err) {
    console.error("[Go Deliver] Database connection failed:", err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`[Go Deliver] Backend running on http://localhost:${PORT}`);
  });
}

main();

process.on("unhandledRejection", (err: unknown) => {
  console.error("Unhandled rejection:", err);
  process.exit(1);
});
