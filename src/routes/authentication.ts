import express from 'express';
import { userStore } from '../database/store/user.store';
import { createPasswordHash, generateToken } from '../utils/helper';
import { User } from '../types/request.type';
const router = express.Router();

router.post('/', async (req, res) => {
     const { username, password } = req.body;
     const user: User = await userStore.getUserByUsernameAndPassword(username, password);
     if (user) {
          const token: string = generateToken();
          try {
               await userStore.saveUserToken(user.id as string, token);
               user.token = token;
               res.status(200).json({ user });
          } catch (e) {
               res.status(500).json({ message: 'Internal server error' });
          }
     } else {
          res.status(401).json({ message: 'Invalid username or password' });
     }
});

export default router;