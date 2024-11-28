import multer from "multer";
import path from "path";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
const prisma = new PrismaClient();

const uploadLocation = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadLocation)) {
  fs.mkdirSync(uploadLocation, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadLocation);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = Date.now() + path.extname(file.originalname);
    cb(null, uniqueFilename);
  },
});
const fileSize = 5;
const upload = multer({
  storage: storage,
  limits: {
    fileSize: fileSize  * 1024 * 1024, 
  },
});

export const uploadFile = (req: Request, res: Response, next: NextFunction) => {
  upload.single("file")(req, res, (err) => {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: `File size must be less than ${fileSize} MB.` });
    } else if (err) {
      return res.status(500).json({ message: "File upload failed." });
    }
    next();
  });
};

export const compressMediaFile = async (inputFilePath: string, mimeType: string): Promise<string> => {
  const fileName = path.basename(inputFilePath);
  const compressedFileName = `compressed_${fileName}`;
  const compressedFilePath = path.join(uploadLocation, compressedFileName);

  return new Promise((resolve, reject) => {
    const command = ffmpeg(inputFilePath);

    if (mimeType.startsWith("audio")) {
      command.outputOptions([
        "-y",
        "-acodec", "libmp3lame",
        "-b:a", "128k",
      ]);
    } else if (mimeType.startsWith("video")) {
      command.outputOptions([
        "-y",
        "-c:v", "libx264",
        "-preset", "fast",
        "-crf", "28",
        "-c:a", "aac",
        "-b:a", "128k",
      ]);
    } else {
      return reject(new Error("Unsupported file type for compression."));
    }

    command
      .output(compressedFilePath)
      .on("start", (commandLine) => {
        console.log("FFmpeg command:", commandLine);
      })
      .on("error", (error) => {
        console.error("FFmpeg error:", error.message);
        reject(new Error("Media compression failed."));
      })
      .on("end", () => {
        console.log("Compression completed:", compressedFilePath);
        resolve(compressedFilePath);
      })
      .run();
  });
};

export const deleteFile = (filePath: string): void => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting the file:", err.message);
    } else {
      console.log("File deleted:", filePath);
    }
  });
};

export const handleFileUpload = async (req: Request, res: Response): Promise<any> => {
  try {
    const { roomname, sender, content } = req.body;

    if (!roomname || !sender) {
      return res.status(400).json({ message: "Missing required fields (roomname, sender)." });
    }

    const room = await prisma.room.findUnique({
      where: { roomname: roomname },
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const messageData: any = {
      roomId: room.id,
      sender,
      content,
    };

    if (req.file) {
      const originalPath = path.join(uploadLocation, req.file.filename);

      try {
        const compressedPath = await compressMediaFile(originalPath, req.file.mimetype);

        deleteFile(originalPath);

        messageData.fileUrl = `/uploads/${path.basename(compressedPath)}`;
        messageData.fileType = req.file.mimetype;
      } catch (error:any) {
        console.error("Error during media compression:", error.message);
        return res.status(500).json({ message: "Error during media compression." });
      }
    }

    const message = await prisma.message.create({
      data: messageData,
    });

    return res.status(200).json({ message: "Message sent", data: message });
  } catch (error : any) {
    console.error("Internal server error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
