import { Router } from "express";
import { prisma } from "../lib/prisma";
import { signToken, cookieOptions } from "../lib/jwt";
import { hashPassword, comparePassword } from "../lib/password";
import { authenticate, authorize, type AuthRequest } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { loginLimiter, apiLimiter } from "../middleware/rateLimit";
import {
  registerSchema,
  loginSchema,
} from "../validation/schemas";
import { AppError } from "../middleware/errorHandler";

const router = Router();

// Setup first admin (no auth - meant to be used once during initial setup)
router.post(
  "/setup-first-admin",
  validate(registerSchema),
  async (req, res, next) => {
    try {
      const existing = await prisma.user.findFirst();
      if (existing) {
        return res.status(400).json({
          success: false,
          error: "Admin already exists",
        });
      }

      const passwordHash = await hashPassword(req.body.password);
      const user = await prisma.user.create({
        data: {
          email: req.body.email,
          passwordHash,
          name: req.body.name,
          role: "ADMIN",
        },
        select: { id: true, email: true, name: true, role: true },
      });

      const token = signToken({ id: user.id, email: user.email, role: user.role });
      res.cookie("token", token, cookieOptions());

      res.status(201).json({ success: true, user });
    } catch (err) {
      next(err);
    }
  }
);

// Login
router.post(
  "/login",
  apiLimiter,
  loginLimiter,
  validate(loginSchema),
  async (req, res, next) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email: req.body.email },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Invalid email or password",
        });
      }

      const valid = await comparePassword(req.body.password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({
          success: false,
          error: "Invalid email or password",
        });
      }

      const token = signToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      res.cookie("token", token, cookieOptions());

      res.json({
        success: true,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      });
    } catch (err) {
      next(err);
    }
  }
);

// Logout
router.post("/logout", (_req, res) => {
  res.clearCookie("token", { path: "/" });
  res.json({ success: true, message: "Logged out" });
});

// Me
router.get("/me", authenticate, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, email: true, name: true, role: true },
  });
  res.json({ success: true, user });
});

// Update Profile & Password (Settings)
router.patch("/profile", authenticate, async (req: AuthRequest, res, next) => {
  try {
    const userId = req.user!.id;
    const { name, currentPassword, newPassword } = req.body || {};

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!currentUser) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const updateData: { name?: string; passwordHash?: string } = {};

    if (name && typeof name === "string" && name.trim()) {
      updateData.name = name.trim();
    }

    if (newPassword) {
      if (typeof newPassword !== "string" || newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          error: "New password must be at least 8 characters long",
        });
      }
      if (currentPassword) {
        const valid = await comparePassword(currentPassword, currentUser.passwordHash);
        if (!valid) {
          return res.status(400).json({
            success: false,
            error: "Current password is incorrect",
          });
        }
      }
      updateData.passwordHash = await hashPassword(newPassword);
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: "No changes provided to update",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, email: true, name: true, role: true },
    });

    res.json({
      success: true,
      message: "Settings updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
