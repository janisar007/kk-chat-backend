import expressAsyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";

export const accessChat = expressAsyncHandler(async (req, res) => {
    const { userId, currentUserId } = req.body;  //ye userId us user ki hai jisse current logged in user connect krna chahta hai.
  
    if (!userId) {
      console.log("UserId param not sent with request");
      return res.sendStatus(400);
    }
  
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: currentUserId } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users")
      .populate("latestMessage");
  
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "authUsername profileUrl email",
    });
  
    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [currentUserId, userId],
      };
  
      try {
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users"
        );
        res.status(200).json(FullChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    }
  });


  //here we are sending those in which current user is a part of ->
export const fetchChats = expressAsyncHandler(async (req, res) => {
    try {
      Chat.find({ users: { $elemMatch: { $eq: req.body.currentUserId } } })
        .populate("users")
        .populate("groupAdmin")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "authUsername profileUrl email",
          });
          res.status(200).send(results);
        });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
});