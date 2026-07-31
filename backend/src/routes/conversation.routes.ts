import { Router } from "express";
import isAuthenticated from "../middlewares/auth.middleware";
import { createConversation, getMyConversations } from "../controllers/conversation.controller";



const conversationRouter = Router()

conversationRouter.post("/", isAuthenticated, createConversation);
conversationRouter.get("/", isAuthenticated, getMyConversations);

export default conversationRouter