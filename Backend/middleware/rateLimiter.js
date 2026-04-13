import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 attempts
  message: {
    success: false,
    message: "Too many login attempts. Try again after 15 minutes.",
  },
});
