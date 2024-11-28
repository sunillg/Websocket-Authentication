import express, { Request, Response, Express } from 'express';
import { PrismaClient } from '@prisma/client';

const app: Express = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get('/:userRole/:mobileNumber', async (req: Request, res: Response): Promise<any> => {
  try {
    const { userRole, mobileNumber } = req.params;
    var user;
    if(userRole === "1"){
       user = await prisma.user.findUnique({
      where: { mobileNumber: mobileNumber as string },
    });}
    
    if(userRole === "2"){
       user = await prisma.user.findUnique({
      where: { mobileNumber: mobileNumber as string, roleId : 1 },
    });}



    if (!user) {
      return res.status(404).json({ message: 'Mobile Number not found' });
    }

    console.log('User found:', user);

    return res.json({ valid:true, mobileNumber : user.mobileNumber , username : user.username});
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default app;
