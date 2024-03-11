import User from "./../../src/database/models/user";
import GroceryItems from "../../src/database/models/groceryItems";
import testHelper from "./../testHelper";
import should from "should";
import request from "supertest";
import server from "./../../src/index";
import _, { create } from "lodash";
import groceryItemData from "./../samples/grocery.json";

describe("GroceryItems operations as Admin", () => {
    const createGroceryItemIds: string[] = [];
    const createdUserIds: string[] = [];
    let authenticatedUser: any;

    beforeEach(async () => {
        authenticatedUser = await testHelper.createUserByRole("admin");
        createdUserIds.push(authenticatedUser.id);
    });
    afterEach(async () => {
        await deleteTestUsers(createdUserIds);
        await deleteTestGroceryItems(createGroceryItemIds);
    });

    it("should create a grocery item and return 200", async () => {
        const groceryItemObject = _.cloneDeep(groceryItemData);
        const response = await request(server)
            .post("/groceryItems/")
            .set("authorization", authenticatedUser.token)
            .send(groceryItemObject);
        should(response.status).be.exactly(200);
        const data = response.body.item;
        should(data.name).be.exactly(groceryItemObject.name);
        createGroceryItemIds.push(data.id);
    });

    it("should update a grocery item and return 200", async () => {
        const [groceryItem]  = await createGroceryItems(1);
        createGroceryItemIds.push(groceryItem.id);

        const response = await request(server)
            .put(`/groceryItems/${groceryItem.id}`)
            .set("authorization", authenticatedUser.token)
            .send({name: "UpdatedName", quantity: 10});
        should(response.status).be.exactly(200);
        const data = response.body.item;
        should(data[0]).be.exactly(1);
        
        const updatedItem = (await GroceryItems.findOne({where: {id: groceryItem.id}}))?.toJSON();
        should(updatedItem.name).be.exactly("UpdatedName");
        should(updatedItem.quantity).be.exactly(10);
    });

    it("should delete a grocery item and return 200", async () => {
        const [groceryItem]  = await createGroceryItems(1);
        const response = await request(server)
            .delete(`/groceryItems/${groceryItem.id}`)
            .set("authorization", authenticatedUser.token);
        should(response.status).be.exactly(200);
        const data = response.body.item;
        should(data[0]).be.exactly(1);
        const deletedItem = (await GroceryItems.findOne({where: {id: groceryItem.id}}))?.toJSON();
        should(deletedItem.deleted).be.exactly("true");
    });

    it("should get all grocery items and return 200", async () => {
        const items = await createGroceryItems(5);
        createGroceryItemIds.push(...items.map((item: any) => item.id));
        const response = await request(server)
            .get("/groceryItems/")
            .set("authorization", authenticatedUser.token);
        should(response.status).be.exactly(200);
        const data = response.body.items;
        should(data.length).be.exactly(5);
        items.forEach((item: any) => {
            should(data.map((item: any) => item.id)).containEql(item.id);
            should(item.deleted).be.exactly("false");
        });
    });
});

describe("GroceryItems operations as User", () => {
    const createGroceryItemIds: string[] = [];
    const createdUserIds: string[] = [];
    let authenticatedUser: any;

    beforeEach(async () => {
        authenticatedUser = await testHelper.createUserByRole("user");
        createdUserIds.push(authenticatedUser.id);
    });
    afterEach(async () => {
        await deleteTestUsers(createdUserIds);
        await deleteTestGroceryItems(createGroceryItemIds);
    });

    it("should not create a grocery item and return 403", async () => {
        const groceryItemObject = _.cloneDeep(groceryItemData);
        const response = await request(server)
            .post("/groceryItems/")
            .set("authorization", authenticatedUser.token)
            .send(groceryItemObject);
        should(response.status).be.exactly(403);
    });

    it("should not update a grocery item and return 403", async () => {
        const [groceryItem]  = await createGroceryItems(1);
        createGroceryItemIds.push(groceryItem.id);

        const response = await request(server)
            .put(`/groceryItems/${groceryItem.id}`)
            .set("authorization", authenticatedUser.token)
            .send({name: "UpdatedName", quantity: 10});
        should(response.status).be.exactly(403);
    });

    it("should not delete a grocery item and return 403", async () => {
        const [groceryItem]  = await createGroceryItems(1);
        createGroceryItemIds.push(groceryItem.id);

        const response = await request(server)
            .delete(`/groceryItems/${groceryItem.id}`)
            .set("authorization", authenticatedUser.token);
        should(response.status).be.exactly(403);
    });

    it("should get all grocery items and return 200", async () => {
        const items = await createGroceryItems(5);
        createGroceryItemIds.push(...items.map((item: any) => item.id));
        const response = await request(server)
            .get("/groceryItems/")
            .set("authorization", authenticatedUser.token);
        should(response.status).be.exactly(200);
        const data = response.body.items;
        should(data.length).be.exactly(5);
        items.forEach((item: any) => {
            should(data.map((item: any) => item.id)).containEql(item.id);
            should(item.deleted).be.exactly("false");
        });
    });
});


async function deleteTestUsers(userIds: string[]) {
    return await User.destroy({ where: { id: userIds } });
}

async function deleteTestGroceryItems(groceryItemIds: string[]) {
    return await GroceryItems.destroy({ where: { id: groceryItemIds } });
}

const createGroceryItems = async (count: number) => {
    const promises = [];
    for (let i = 0; i < count; i++) {
        const groceryItem = _.cloneDeep(groceryItemData);
        groceryItem.name = `Demo-Item${i}`;
        promises.push(GroceryItems.create(groceryItem));
    }
    const items = await Promise.all(promises);
    return items.map((item: any) => item.toJSON());
};