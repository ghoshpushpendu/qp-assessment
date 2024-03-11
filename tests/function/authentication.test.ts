import should from "should";
import request from "supertest";
import server from "./../../src/index";
import User from "../../src/database/models/user";
import userdata from "./../samples/user.json";
import { createPasswordHash } from "../../src/utils/helper";
import _ from "lodash";
import Sinon = require("sinon");
import { userStore } from "../../src/database/store/user.store";
import { User as UserType } from "../../src/types/request.type";

describe("Authentication", () => {
    const createUserIds : string[] = [];
    const userStoreMocker = Sinon.mock(userStore);

    afterEach(async () => {
        await deleteTestUsers(createUserIds);
        Sinon.restore();
    });
    
    async function createTestUser() {
        const userObject : UserType = _.cloneDeep(userdata);
        userObject.password = createPasswordHash(userObject.password);
        return await User.create(userObject);
    };

    async function deleteTestUsers(userIds: string[])  {
        return await User.destroy({ where: { id: userIds } });
    }

    it("should not authenticate if user does not exist", async () => {
        const response = await request(server).post("/authenticate/").send({
            username: "user",
            password: "password"
        });
        should(response.status).be.exactly(401);
    });

    it("should authenticate if user exists", async () => {
        const user : any = await createTestUser();
        createUserIds.push(user.dataValues.id);
        const response = await request(server).post("/authenticate/").send({
            username: userdata.username,
            password: userdata.password
        });
        const data : UserType = response.body.user;
        should(response.status).be.exactly(200);
        should(data.username).be.exactly(userdata.username);
        should(data.token).not.be.Null();
    });

    it("should retunr 500 if user token cannot be saved", async () => {
        userStoreMocker.expects("saveUserToken").once().throws(new Error("Error"));
        const user = await createTestUser();
        createUserIds.push(user.dataValues.id);
        const response = await request(server).post("/authenticate/").send({
            username: userdata.username,
            password: userdata.password
        });
        should(response.status).be.exactly(500);
    });
});