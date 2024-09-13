import expressAsyncHandler from "express-async-handler";
import User from "../models/user.model.js";


export const getUserById = expressAsyncHandler(async (req, res) => {
    try {
      const messages = await User.find({ authId: req.params.authId })
      console.log()

      res.status(200).json(messages);

    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });