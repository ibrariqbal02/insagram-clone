import { Router } from "express";
import isAuthenticated from "../middlewares/auth.middleware";
import { deleteMessage, getMessages, sendMessage } from "../controllers/message.controller";




const messageRouter = Router()
messageRouter.post(
  "/:conversationId",
  isAuthenticated,
  sendMessage
);

messageRouter.get(
  "/:conversationId",
  isAuthenticated,
  getMessages
);

messageRouter.delete(
  "/:messageId",
  isAuthenticated,
  deleteMessage
);
export default messageRouter