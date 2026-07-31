import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import connectMongoose from "./config/database";

import cookieParser from "cookie-parser";
import multer from "multer";
import router from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";
import commentRoutes from "./routes/comment.routes";
import followRouter from "./routes/follow.routes";
import feedRouter from "./routes/feed.routes";
import searchRouter from "./routes/search.routes";
import notificationRourer from "./routes/notification.routes";
import conversationRouter from "./routes/conversation.routes";

const app: Application = express();

const PORT: number = Number( process.env.PORT )|| 5000;
connectMongoose();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));



//  Routes

app.use("/api/auth",router)
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/follow", followRouter);
app.use("/api/feed",feedRouter)
app.use('/api/search',searchRouter)
app.use('/api/notification', notificationRourer)
app.use('/api/conversation',conversationRouter)

app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof Error) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
