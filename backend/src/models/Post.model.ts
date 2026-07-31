import { Schema, model, Types } from "mongoose";

const postSchema = new Schema(
  {
    owner: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    caption: {
      type: String,
      default: "",
      trim: true,
    },

 images: [
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
],

    likes: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],

    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Post = model("Post", postSchema);

export default Post;
