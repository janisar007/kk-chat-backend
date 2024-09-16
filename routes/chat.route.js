import express from "express"
import { accessChatwithPost, fetchChats } from "../controllers/chat.controller.js";

const router = express.Router();

router.route("/").post(accessChatwithPost);
router.route("/:currentUserId").get(fetchChats);

export default router