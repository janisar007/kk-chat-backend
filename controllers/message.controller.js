import expressAsyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import { Chat } from "../models/chat.model.js";
import CropPost from "../models/croppost.model.js";

export const sendMessage = expressAsyncHandler(async (req, res) => {
    const { content, chatId, currentUserId } = req.body;
  
    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }
  
    var newMessage = {
      sender: currentUserId,
      content: content,
      chat: chatId,
    };
  
    try {
      var message = await Message.create(newMessage);
  
      message = await message.populate("sender", "authUsername profileUrl")
      message = await message.populate("chat")
      message = await User.populate(message, {
        path: "chat.users",
        select: "authUsername profileUrl email",
      });
      message = await CropPost.populate(message, {
        path: "chat.post",
        // select: "",
      });
  
      await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
  
      res.json(message);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });

export const allMessages = expressAsyncHandler(async (req, res) => {
    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "authUsername profileUrl email")
        .populate("chat");
      res.json(messages);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
});