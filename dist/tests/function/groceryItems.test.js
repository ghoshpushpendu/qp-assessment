"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("./../../src/database/models/user"));
const groceryItems_1 = __importDefault(require("../../src/database/models/groceryItems"));
const testHelper_1 = __importDefault(require("./../testHelper"));
const should_1 = __importDefault(require("should"));
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("./../../src/index"));
const lodash_1 = __importDefault(require("lodash"));
const grocery_json_1 = __importDefault(require("./../samples/grocery.json"));
describe("GroceryItems operations as Admin", () => {
    const createGroceryItemIds = [];
    const createdUserIds = [];
    let authenticatedUser;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        authenticatedUser = yield testHelper_1.default.createUserByRole("admin");
        createdUserIds.push(authenticatedUser.id);
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield deleteTestUsers(createdUserIds);
        yield deleteTestGroceryItems(createGroceryItemIds);
    }));
    it("should create a grocery item and return 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const groceryItemObject = lodash_1.default.cloneDeep(grocery_json_1.default);
        const response = yield (0, supertest_1.default)(index_1.default)
            .post("/groceryItems/")
            .set("authorization", authenticatedUser.token)
            .send(groceryItemObject);
        (0, should_1.default)(response.status).be.exactly(200);
        const data = response.body.item;
        (0, should_1.default)(data.name).be.exactly(groceryItemObject.name);
        createGroceryItemIds.push(data.id);
    }));
    it("should update a grocery item and return 200", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const [groceryItem] = yield createGroceryItems(1);
        createGroceryItemIds.push(groceryItem.id);
        const response = yield (0, supertest_1.default)(index_1.default)
            .put(`/groceryItems/${groceryItem.id}`)
            .set("authorization", authenticatedUser.token)
            .send({ name: "UpdatedName", quantity: 10 });
        (0, should_1.default)(response.status).be.exactly(200);
        const data = response.body.item;
        (0, should_1.default)(data[0]).be.exactly(1);
        const updatedItem = (_a = (yield groceryItems_1.default.findOne({ where: { id: groceryItem.id } }))) === null || _a === void 0 ? void 0 : _a.toJSON();
        (0, should_1.default)(updatedItem.name).be.exactly("UpdatedName");
        (0, should_1.default)(updatedItem.quantity).be.exactly(10);
    }));
    it("should delete a grocery item and return 200", () => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        const [groceryItem] = yield createGroceryItems(1);
        const response = yield (0, supertest_1.default)(index_1.default)
            .delete(`/groceryItems/${groceryItem.id}`)
            .set("authorization", authenticatedUser.token);
        (0, should_1.default)(response.status).be.exactly(200);
        const data = response.body.item;
        (0, should_1.default)(data[0]).be.exactly(1);
        const deletedItem = (_b = (yield groceryItems_1.default.findOne({ where: { id: groceryItem.id } }))) === null || _b === void 0 ? void 0 : _b.toJSON();
        (0, should_1.default)(deletedItem.deleted).be.exactly("true");
    }));
    it("should get all grocery items and return 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const items = yield createGroceryItems(5);
        createGroceryItemIds.push(...items.map((item) => item.id));
        const response = yield (0, supertest_1.default)(index_1.default)
            .get("/groceryItems/")
            .set("authorization", authenticatedUser.token);
        (0, should_1.default)(response.status).be.exactly(200);
        const data = response.body.items;
        (0, should_1.default)(data.length).be.exactly(5);
        items.forEach((item) => {
            (0, should_1.default)(data.map((item) => item.id)).containEql(item.id);
            (0, should_1.default)(item.deleted).be.exactly("false");
        });
    }));
});
describe("GroceryItems operations as User", () => {
    const createGroceryItemIds = [];
    const createdUserIds = [];
    let authenticatedUser;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        authenticatedUser = yield testHelper_1.default.createUserByRole("user");
        createdUserIds.push(authenticatedUser.id);
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield deleteTestUsers(createdUserIds);
        yield deleteTestGroceryItems(createGroceryItemIds);
    }));
    it("should not create a grocery item and return 403", () => __awaiter(void 0, void 0, void 0, function* () {
        const groceryItemObject = lodash_1.default.cloneDeep(grocery_json_1.default);
        const response = yield (0, supertest_1.default)(index_1.default)
            .post("/groceryItems/")
            .set("authorization", authenticatedUser.token)
            .send(groceryItemObject);
        (0, should_1.default)(response.status).be.exactly(403);
    }));
    it("should not update a grocery item and return 403", () => __awaiter(void 0, void 0, void 0, function* () {
        const [groceryItem] = yield createGroceryItems(1);
        createGroceryItemIds.push(groceryItem.id);
        const response = yield (0, supertest_1.default)(index_1.default)
            .put(`/groceryItems/${groceryItem.id}`)
            .set("authorization", authenticatedUser.token)
            .send({ name: "UpdatedName", quantity: 10 });
        (0, should_1.default)(response.status).be.exactly(403);
    }));
    it("should not delete a grocery item and return 403", () => __awaiter(void 0, void 0, void 0, function* () {
        const [groceryItem] = yield createGroceryItems(1);
        createGroceryItemIds.push(groceryItem.id);
        const response = yield (0, supertest_1.default)(index_1.default)
            .delete(`/groceryItems/${groceryItem.id}`)
            .set("authorization", authenticatedUser.token);
        (0, should_1.default)(response.status).be.exactly(403);
    }));
    it("should get all grocery items and return 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const items = yield createGroceryItems(5);
        createGroceryItemIds.push(...items.map((item) => item.id));
        const response = yield (0, supertest_1.default)(index_1.default)
            .get("/groceryItems/")
            .set("authorization", authenticatedUser.token);
        (0, should_1.default)(response.status).be.exactly(200);
        const data = response.body.items;
        (0, should_1.default)(data.length).be.exactly(5);
        items.forEach((item) => {
            (0, should_1.default)(data.map((item) => item.id)).containEql(item.id);
            (0, should_1.default)(item.deleted).be.exactly("false");
        });
    }));
});
function deleteTestUsers(userIds) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield user_1.default.destroy({ where: { id: userIds } });
    });
}
function deleteTestGroceryItems(groceryItemIds) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield groceryItems_1.default.destroy({ where: { id: groceryItemIds } });
    });
}
const createGroceryItems = (count) => __awaiter(void 0, void 0, void 0, function* () {
    const promises = [];
    for (let i = 0; i < count; i++) {
        const groceryItem = lodash_1.default.cloneDeep(grocery_json_1.default);
        groceryItem.name = `Demo-Item${i}`;
        promises.push(groceryItems_1.default.create(groceryItem));
    }
    const items = yield Promise.all(promises);
    return items.map((item) => item.toJSON());
});
