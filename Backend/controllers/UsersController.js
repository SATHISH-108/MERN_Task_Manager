import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import { redis } from "../config/redis.js";

const ACCESS_TTL = "15m";
const ACCESS_TTL_MS = 15 * 60 * 1000;
const REFRESH_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days
const REFRESH_TTL_MS = REFRESH_TTL_SECONDS * 1000;

const isProd = process.env.NODE_ENV === "production";

const accessCookieOpts = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: ACCESS_TTL_MS,
  path: "/",
};

const refreshCookieOpts = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  maxAge: REFRESH_TTL_MS,
  path: "/",
};

const signAccess = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TTL,
  });

const signRefresh = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TTL_SECONDS,
  });

const usersRegister = async (request, response) => {
  try {
    const { name, email, password, role } = request.body;
    if (!name || !email || !password) {
      return response
        .status(400)
        .json({ success: false, message: "All Fields Are Required" });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return response
        .status(400)
        .json({ success: false, message: "Email Already Taken" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    return response.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: `${user.role} Registered Successfully`,
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);
    return response
      .status(500)
      .json({ success: false, message: "Something Went Wrong" });
  }
};

const usersLogin = async (request, response) => {
  try {
    const { email, password } = request.body;
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return response
        .status(404)
        .json({ success: false, message: "User Not Found" });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return response
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const accessToken = signAccess(existingUser);
    const refreshToken = signRefresh(existingUser);

    await redis.set(
      `refresh:${existingUser._id.toString()}`,
      refreshToken,
      "EX",
      REFRESH_TTL_SECONDS,
    );

    response.cookie("accessToken", accessToken, accessCookieOpts);
    response.cookie("refreshToken", refreshToken, refreshCookieOpts);

    return response.status(200).json({
      success: true,
      loginUser: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
      message: `${existingUser.role} Login Successfully`,
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    return response
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const refresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const stored = await redis.get(`refresh:${decoded.id}`);
    if (!stored || stored !== refreshToken) return res.sendStatus(403);

    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: ACCESS_TTL },
    );

    res.cookie("accessToken", accessToken, accessCookieOpts);
    return res.json({ success: true });
  } catch (err) {
    console.log("REFRESH ERROR:", err.message);
    return res.sendStatus(403);
  }
};

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.JWT_REFRESH_SECRET,
        );
        await redis.del(`refresh:${decoded.id}`);
      } catch {}
    }
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });
    return res.json({ success: true, message: "Logged out" });
  } catch {
    return res.status(500).json({ success: false });
  }
};

export { usersRegister, usersLogin, refresh, logout };
