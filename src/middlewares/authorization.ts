import { userStore } from "../database/store/user.store";
import { User } from "../types/request.type";

const authorize = async (req: any, res: any, next: any) => {
    const token : string = req.headers['authorization'];
    if (token) {
        const user: User = await userStore.getUserByToken(token);
        if (user) {
            req.user = user;
            next();
        } else {
            res.status(401).json({ message: 'Unauthorized' });
        }
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

export default {
    authorize
}

