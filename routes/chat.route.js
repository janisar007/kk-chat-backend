import express from "express"
import { accessChat, fetchChats } from "../controllers/chat.controller.js";

const router = express.Router();

router.route("/").post(accessChat);
router.route("/:currentUserId").get(fetchChats);

export default router