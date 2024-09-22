import expressAsyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";
import CropPost from "../models/croppost.model.js";

export const accessChatwithPost = expressAsyncHandler(async (req, res) => {
  const { userId, currentUserId, postId } = req.body; // userId: the user to connect with
  // console.log("postId", postId)

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }


  let isChat;

  isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: currentUserId } } },
      { users: { $elemMatch: { $eq: userId } } },
      { post: { $elemMatch: { $eq: postId } } },
    ],
  })
    .populate("users")
    .populate("latestMessage")
    .populate("post")


  

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "authUsername profileUrl email",
  });



  if (isChat.length > 0) {
    res.send(isChat[0]);

  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [currentUserId, userId],
      post: [postId]
    };

    try {


      const createdChat = await Chat.create(chatData);
      console.log(createdChat)
      const FullChat = await Chat.findOne({ _id: createdChat._id })
        .populate("post") // Populate the crop field
        // .populate("users");


      res.status(200).json(FullChat);
    } catch (error) {
      res.status(500);
      console.log(error)
      throw new Error(error.message);
    }
  }
});


  //here we are sending those in which current user is a part of ->
export const fetchChats = expressAsyncHandler(async (req, res) => {
    try {

        const {currentUserId} = req.params;


        // console.log(currentUserId)
      Chat.find({ users: { $elemMatch: { $eq: currentUserId } } })
        .populate("users")
        // .populate("groupAdmin")
        .populate("latestMessage")
        .populate("post")
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

