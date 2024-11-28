// import express, { Request, Response } from "express";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
// const router = express.Router();


// router.get("/:roomname", async (req: Request, res: Response):Promise<any> => {
//   try {
//     const { roomname } = req.params;

//     const room = await prisma.room.findUnique({
//       where: { roomname: roomname },
//       include: {
//         messages: true, 
//       },
//     });

//     if (!room) {
//       return res.status(404).json({ message: "Room not found" });
//     }

//     return res.status(200).json({ messages: room.messages });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// });

// export default router;
