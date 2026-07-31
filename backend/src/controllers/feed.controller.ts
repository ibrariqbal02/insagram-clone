import { Request, Response } from "express";
import User from "../models/User.model";
import Post from "../models/Post.model";

export const getFeed = async (
  req: Request,
  res: Response
) => {
  try {
    const currentUser = await User.findById(req.userId);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    
    const users = [
      ...currentUser.following,
      currentUser._id,
    ];

    const posts = await Post.find({
      owner: {
        $in: users,
      },
    })
      .populate(
        "owner",
        "name username profilePicture"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      totalPosts: posts.length,
      posts,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};