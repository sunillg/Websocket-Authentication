import express, { Request, Response, Express } from 'express';
import { PrismaClient } from '@prisma/client';


const app: Express = express()
const prisma = new PrismaClient(); 

app.use(express.json());

app.get("/:roomname", async(req: Request, res: Response):Promise<any> => {
  const { roomname } = req.params;

  try {
    const roomDetails = await prisma.room.findUnique({
      where: {
        roomname: roomname, 
      },
      include: {
        messages: true, 
      },
    });

    if (roomDetails) {
      return res.json(roomDetails);
    } else {
      return res.status(404).json({ error: "Room not found" });
    }
  } catch (error) {
    console.error("Error fetching room details:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

export default app;