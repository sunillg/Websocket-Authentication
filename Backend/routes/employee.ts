import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const employees = await prisma.employees.findMany();
    return res.status(200).json({ employees });
  } catch (error) {
    console.error('Fetch Error:', error);
    return res.status(500).json({ message: 'Internal servre error' });
  }
});

export default router;



