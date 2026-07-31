import { Request, Response } from "express";
import uploadToCloudinary from "../utils/uploadToCloudinary";
import Post from "../models/Post.model";
import deleteFromCloudinary from "../utils/deleteFromCloudinary";
import Notification from "../models/Notification.model";
import mongoose from "mongoose";
import fs from "node:fs/promises";

export const createPost = async (req: Request, res: Response) => {
  try {
    const { caption } = req.body;

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image.",
      });
    }

    const images: { url: string; publicId: string }[] = [];

    for (const file of files) {
      try {
        const result = await uploadToCloudinary(file.path, "posts");

        images.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      } finally {
        await fs.unlink(file.path).catch(() => {});
      }
    }

    const post = await Post.create({
      owner: req.userId,
      caption,
      images,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully.",
      post,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
    });
  }
};

export const getMyPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({
      owner: req.userId,
    })
      .populate("owner", "name username profilePicture")
      .sort({ createdAt: -1 });
    console.log("User ID:", req.userId);

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
export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({
      owner: userId, // use "user" here if your schema uses user instead of owner
    })
      .populate("owner", "name username profilePicture")
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

export const getSinglePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate(
      "owner",
      "name username profilePicture"
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const { caption } = req.body;

    const files = req.files as Express.Multer.File[];

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    if (post.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized.",
      });
    }

    if (caption) {
      post.caption = caption;
    }

    // Replace images if new images are uploaded
    if (files && files.length > 0) {
      // Delete old images
      for (const image of post.images) {
        await deleteFromCloudinary(image.publicId);
      }

      const newImages = [];

      for (const file of files) {
        try {
          const result = await uploadToCloudinary(file.path, "posts");

          newImages.push({
            url: result.secure_url,
            publicId: result.public_id,
          });
        } finally {
          await fs.unlink(file.path).catch(() => {});
        }
      }

      post.images = newImages as typeof post.images;
    }

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post updated successfully.",
      post,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    if (post.owner.toString() !== req.userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized.",
      });
    }

    for (const image of post.images) {
      await deleteFromCloudinary(image.publicId);
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const likeUnlikePost = async (req: Request, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    const alreadyLiked = post.likes.some((id) => id.toString() === req.userId);

    if (alreadyLiked) {
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: req.userId },
      });
      await Notification.findOneAndDelete({
        sender: req.userId,
        receiver: post.owner,
        post: post._id,
        type: "like",
      });
      return res.status(200).json({
        success: true,
        message: "Post unliked successfully.",
      });
    }

    post.likes.push(new mongoose.Types.ObjectId(req.userId));

    await post.save();

    if (post.owner.toString() !== req.userId) {
      const notifi = await Notification.create({
        sender: req.userId,
        receiver: post.owner,
        post: post._id,
        type: "like",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Post liked successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
