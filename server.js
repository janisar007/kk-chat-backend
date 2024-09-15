import express from "express"
import { connectDB } from "./config/db.js";
import dotenv from "dotenv"

import cors from "cors"

import userRoutes from "./routes/user.route.js"
import chatRoutes from "./routes/chat.route.js"
import messageRoutes from "./routes/message.route.js"
import { errorHandler, notFound } from "./middlewares/error.middleware.js";

dotenv.config()
connectDB()
const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}))

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);




app.listen(3001, () => console.log("listening on 3001..."))

