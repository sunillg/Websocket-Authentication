import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const users: { [socketId: string]: { roomname: string, userName: string } } = {};

export const handleRoomEvents = (socket: Socket, io: Server) => {
  socket.on('join', async ({ roomname, senderMobileNumber, receiverMobileNumber }, callback) => {
    try {
      let room = await prisma.room.findUnique({
        where: { roomname },
      });

      if (!room) {
        room = await prisma.room.create({
          data: {
            roomname,
            senderMobileNumber,
            receiverMobileNumber,
          },
        });
      }

      let userName = await prisma.user.findUnique({
        where: { mobileNumber: senderMobileNumber },
      });

      users[socket.id] = { roomname, userName: userName?.username || 'Unknown' };

      socket.join(roomname);
      // socket.emit('message', { text: `Online` });
      socket.broadcast.to(roomname).emit('message', { text: `Online` });

      io.to(roomname).emit('roomMembers', await prisma.room.findMany({
        where: { roomname },
      }));

      callback(null);
    } catch (error) {
      console.error('Error handling room join:', error);
      callback('Error handling room join');
    }
  });

  const badWords = ["word1", "word2", "word3"];

  const restrictWords = (message: string) => {
    let modifiedMessage = message;
  
    badWords.forEach((word) => {
      const findWord = new RegExp(`\\b${word}\\b`, 'gi'); 
      modifiedMessage = modifiedMessage.replace(findWord, '***');
    });
  
    return modifiedMessage;
  };

  

  socket.on('sendMessage', async ({ roomname, sender, message }, callback) => {
    try {
      const modifiedMessage = restrictWords(message);

    if (modifiedMessage !== message) {
      console.log('This message contains restricted words.');
      socket.emit('restrictedMessage', { error: 'This message contains restricted words.' });
      io.to(roomname).emit('message', { user: sender, text: modifiedMessage });
      return callback('This message contains restricted words.');
    } 



      const room = await prisma.room.findUnique({
        where: { roomname },
      });

      if (!room) {
        return callback('Room does not exist while sending message');
      }

      await prisma.message.create({
        data: {
          roomId: room.id,
          sender,
          content: message,
        },
      });

      io.to(roomname).emit('message', { user: sender, text: message });

      callback(null);
    } catch (error) {
      console.error('Error sending message:', error);
      callback('Error sending message');
    }
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];

    if (user) {
      const { roomname, userName } = user;

      socket.broadcast.to(roomname).emit('message', { 
        text: `Offline` 
      });

      // console.log(`${userName} disconnected from room ${roomname}`);

      delete users[socket.id];
    }
  });
};
