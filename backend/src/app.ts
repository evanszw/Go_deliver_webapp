import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth";
import requestRoutes from "./routes/requests";
import { apiLimiter } from "./middleware/rateLimit";
import { env, IS_PRODUCTION } from "./config";

const app = express();

app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    frameguard: false,
  })
);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

app.use("/api", apiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api", requestRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "go-deliver-backend" });
});

app.use(errorHandler);

export default app;
