import { User } from '../../types/request.type';
import { createPasswordHash } from '../../utils/helper';
import user from './../models/user';

export const userStore = {
    createUser: async (requestedUser: User) : Promise<User> => {
        const resp = await user.create({ ...requestedUser, password: createPasswordHash(requestedUser.password) });
        return resp.toJSON();
    },
    getUserByToken: async (token: string) : Promise<User> => {
        const resp = await user.findOne({ where: { token: token } });
        return resp?.toJSON() as User;
    },
    getUserByUsernameAndPassword: async (username: string, password: string) : Promise<User> => {
        const resp = await user.findOne({ where: { username: username, password: createPasswordHash(password) } });
        return resp?.toJSON() as User;
    },
    saveUserToken: async (id: string, token: string) : Promise<Object> => {
        return await user.update({ token: token }, { where: { id: id } });
    },
};