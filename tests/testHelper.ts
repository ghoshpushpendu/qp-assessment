import userData from "./samples/user.json";
import { userStore } from "../src/database/store/user.store";
import _ from "lodash";
import { generateToken } from "../src/utils/helper";

const authHelper = {
    createUserByRole : async (role:string) => {
        const userObject : any = _.cloneDeep(userData);
        userObject.role = role;
        userObject.username = _.random(0, 100000).toString();
        userObject.token = generateToken();
        return await userStore.createUser(userObject); 
    },
};

export default authHelper;