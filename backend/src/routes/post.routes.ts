import { Router } from "express";
import { createPost, deletePost, getMyPosts, getSinglePost, getUserPosts, likeUnlikePost, updatePost } from "../controllers/post.controller";
import isAuthenticated from "../middlewares/auth.middleware";
import upload from "../config/multer";

const postRoutes = Router();

postRoutes.post(
  "/create",
  isAuthenticated,
  upload.array("images", 5),
  createPost
);

postRoutes.get("/my-posts", isAuthenticated, getMyPosts);
postRoutes.get("/user/:userId", getUserPosts);
postRoutes.get("/:postId", getSinglePost);
postRoutes.put(
  "/:postId",
  isAuthenticated,
  upload.array("images", 5),
  updatePost
);

postRoutes.delete(
  "/:postId",
  isAuthenticated,
  deletePost
);
postRoutes.put("/:postId/like", isAuthenticated, likeUnlikePost);

export default postRoutes;
