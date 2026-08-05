import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshToken,
  getMyProfile,
  getUserProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  deleteAccount,

} from "../controllers/auth.controller";
import isAuthenticated from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", isAuthenticated, logout);

router.post("/refresh-token", refreshToken);

router.get("/me", isAuthenticated, getMyProfile);
router.get("/profile/:userId", getUserProfile);
router.put("/update-profile", isAuthenticated,updateProfile);
router.patch("/change-password", isAuthenticated, changePassword);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password", resetPassword);
router.delete("/delete-account", isAuthenticated, deleteAccount);


export default router;
