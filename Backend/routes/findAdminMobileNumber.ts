import express, { Request, Response, Express } from 'express';
import { PrismaClient } from '@prisma/client';

const app: Express = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findFirst({
    //   where: { mobileNumber },
    })
    
  
    if (!user) {
      return res.status(404).json({ message: 'Mobile Number not found' });
    }

    console.log('User found:', user);

    return res.json({ findNumber : true, mobileNumber : user.mobileNumber });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default app;
