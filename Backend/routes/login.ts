import express, { Request, Response, Express } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';


const app: Express = express()
const prisma = new PrismaClient(); 
dotenv.config();

app.use(express.json());

const JWT_SECRET:any = process.env.JWT_SECRET;




app.post('/', async (req: Request, res: Response):Promise<any>   => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({where : {username: username}});
    if (!user) {
      return res.status(400).json({ message: 'Invalid username!' });
    }
   
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }   
      // console.log('Password does not match');

    const jwttoken = jwt.sign({ username: user.username }, JWT_SECRET);
    const token= await bcrypt.hash(jwttoken, 10);
    // console.log(token);
    

    // console.log('Hitting');

    return res.json({ message: "Login Successful ", login : true , user : user,  token });
  } catch (error) {
    // console.error('Login Err : ', error);
    return res.status(500).json({ message: 'server error' });
  }
});

export default app;