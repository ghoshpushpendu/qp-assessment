import express from 'express';
import { userStore } from '../database/store/user.store';
import { User } from '../types/request.type';
const router = express.Router();

router.get('/', (req: any, res) => {
    const user: User = req.user;
    res.status(200).json({ user });
});

router.post('/', async (req: any, res) => {
    const user: User = req.body;
    const authenticatedUser: User = req.user;
    if (authenticatedUser.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden' });
        return;
    }
    try {
        const createdUser: User = await userStore.createUser(user);
        res.status(200).json({ user: createdUser });
    } catch (e:any) {
        res.status(500).json({ error: e.message });
    }
});

export default router;