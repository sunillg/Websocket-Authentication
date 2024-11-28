import express, { Request, Response } from "express";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import router from "./routes/routes";
import { handleRoomEvents } from "./routes/roomCreate";
import { uploadFile, handleFileUpload } from "./routes/fileUpload";
import { handleMediaEvents } from "./routes/streamEvent"; 

dotenv.config();
const prisma = new PrismaClient();
const app = express();

const uploadsDir = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsDir));

app.use(cors());
app.use(express.json());
app.use("/api", router);

app.post("/api/upload", uploadFile, handleFileUpload);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*"
  },
});

io.on("connection", (socket) => {
  handleRoomEvents(socket, io);

  handleMediaEvents(socket, io);
});

app.get(
  "/chatRoom/:loginMobile",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { loginMobile } = req.params;
      const usersDetails = await prisma.room.findMany({
        where: {
          OR: [
            { receiverMobileNumber: loginMobile },
            { senderMobileNumber: loginMobile },
          ],
        },
        include:{
          users : true
        }
      });

      return res.json({ usersDetails: usersDetails });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

const PORT = 3000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
