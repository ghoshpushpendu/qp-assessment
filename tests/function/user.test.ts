import request from "supertest";
import _ from "lodash";
import User from "../../src/database/models/user";
import userdata from "./../samples/user.json";
import should from "should";
import server from "./../../src/index";
import testHelper from "./../testHelper";

describe("User", () => {
    const createUserIds : string[] = [];

    afterEach(async () => {
        await deleteTestUsers(createUserIds);
    });

    it("should not create a user and should return 401 authorised", async () => {
        const userObject = _.cloneDeep(userdata);
        const response = await request(server).post("/user/").send(userObject);
        should(response.status).be.exactly(401);
    });

    it("should create a user and return 200", async () => {
        const { token, id } = await testHelper.createUserByRole("admin");
        createUserIds.push(id as string);
        const userObject = _.cloneDeep(userdata);
        const response = await request(server)
        .post("/user/")
        .set("authorization", token as string)
        .send(userObject);
        should(response.status).be.exactly(200);
        const data = response.body.user;
        should(data.username).be.exactly(userdata.username);
        createUserIds.push(data.id);
    });

    it("should not create a duplicate user with name username", async () => {
        const { token, id, username } = await testHelper.createUserByRole("admin");
        createUserIds.push(id as string);
        const userObject : any = _.cloneDeep(userdata);
        userObject.username = username;
        const response = await request(server)
        .post("/user/")
        .set("authorization", token as string)
        .send(userObject);
        should(response.status).be.exactly(500);
        should(response.body.error).be.exactly("Validation error");
    });

    it("should not create a user if not admin", async () => {
        const { token, id } = await testHelper.createUserByRole("user");
        createUserIds.push(id as string);
        const userObject = _.cloneDeep(userdata);
        const response = await request(server)
        .post("/user/")
        .set("authorization", token as string)
        .send(userObject);
        should(response.status).be.exactly(403);
        should(response.body.error).be.exactly("Forbidden");
    });

    async function deleteTestUsers(userIds: string[])  {
        return await User.destroy({ where: { id: userIds } });
    }
});