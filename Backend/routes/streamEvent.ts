import { Socket } from 'socket.io';
import fs from 'fs';
import path from 'path';

const formatFileSize = (sizeInBytes: number): string => {
  if (typeof sizeInBytes !== "number" || sizeInBytes <= 0) return "Invalid size";
  if (sizeInBytes < 1024) return `${sizeInBytes} bytes`;
  if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(2)} KB`;
  if (sizeInBytes < 1024 * 1024 * 1024) return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(sizeInBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

export const handleMediaEvents = (socket: Socket, io: unknown) => {
  socket.on("send_message", (message) => {
    let responseMessage = "";

    try {
      switch (message) {
        case "1":
          responseMessage = "Help: Available commands: \n2. Video KB \n3. Video MB \n4. Video GB \n5. Audio KB \n6. Audio MB";
          socket.emit("receive_message", responseMessage);
          break;

        case "2": case "3": case "4": case "5": case "6": {
          const fileType = message < "5" ? "video" : "audio";
          const fileNumber = message === "2" ? "2" :
                             message === "3" ? "3" :
                             message === "4" ? "4" : 
                             message === "5" ? "5" : 
                             message === "6" ? "6" : "";

          const fileExtension = fileType === "video" ? "mp4" : "mp3"; 
          const filePath = path.join(__dirname, "public", "assets", fileType, `${fileType}${fileNumber}.${fileExtension}`);

          console.log(`Looking for file at: ${filePath}`);

          try {
            if (fs.existsSync(filePath)) {
              const stats = fs.statSync(filePath);
              socket.emit(`${fileType}_metadata`, { name: `${fileType}${fileNumber}.${fileExtension}`, size: formatFileSize(stats.size), type: `${fileType}/${fileExtension}` });

              const stream = fs.createReadStream(filePath);

              stream.on("data", (chunk) => socket.emit(`${fileType}_chunk`, chunk));
              stream.on("end", () => socket.emit(`${fileType}_end`));
            } else {
              throw new Error(`${fileType} file not found at ${filePath}`);
            }
          } catch (error: any) {
            console.error("Error reading file:", error);
            socket.emit("error_message", error.message);  
          }
          break;
        }

        default:
          responseMessage = "Invalid command. Send '1' for help.";
          socket.emit("receive_message", responseMessage);
          break;
      }
    } catch (error) {
      console.error("An error occurred while processing the message:", error);
      socket.emit("error_message", "An unexpected error occurred. Please try again later.");
    }
  });
};
