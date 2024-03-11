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
const testHelper_1 = __importDefault(require("./../testHelper"));
const grocery_json_1 = __importDefault(require("./../samples/grocery.json"));
const lodash_1 = __importDefault(require("lodash"));
const groceryItems_1 = __importDefault(require("../../src/database/models/groceryItems"));
const cartItems_1 = __importDefault(require("../../src/database/models/cartItems"));
const user_1 = __importDefault(require("../../src/database/models/user"));
const should_1 = __importDefault(require("should"));
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../../src/index"));
describe('cartItems as user', () => {
    let authenticatedUser;
    const createdUserIds = [];
    const createdGroceryItemIds = [];
    const createdCartItemsIds = [];
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        authenticatedUser = yield testHelper_1.default.createUserByRole('user');
        createdUserIds.push(authenticatedUser.id);
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield deleteTestUsers(createdUserIds);
        yield deleteTestGroceryItems(createdGroceryItemIds);
        yield deleteTestCartItems(createdCartItemsIds);
    }));
    it('should add a cart item and return 200', () => __awaiter(void 0, void 0, void 0, function* () {
        const groceryItem = yield createGroceryItem();
        createdGroceryItemIds.push(groceryItem[0].id);
        const response = yield (0, supertest_1.default)(index_1.default)
            .post('/cartItems/')
            .set('authorization', authenticatedUser.token)
            .send({ userId: authenticatedUser.id, groceryItemId: groceryItem[0].id, quantity: 2 });
        (0, should_1.default)(response.status).be.exactly(200);
        const data = response.body;
        (0, should_1.default)(data.userId).be.exactly(authenticatedUser.id);
        (0, should_1.default)(data.groceryItemId).be.exactly(groceryItem[0].id);
        (0, should_1.default)(data.quantity).be.exactly(2);
    }));
    it('should get cart items and return 200', () => __awaiter(void 0, void 0, void 0, function* () {
        const groceryItem = yield createGroceryItem();
        createdGroceryItemIds.push(groceryItem[0].id);
        yield createCartItem(authenticatedUser.id, groceryItem[0].id, 2);
        const response = yield (0, supertest_1.default)(index_1.default)
            .get('/cartItems/')
            .set('authorization', authenticatedUser.token);
        (0, should_1.default)(response.status).be.exactly(200);
        const data = response.body;
        (0, should_1.default)(data.length).be.exactly(1);
        (0, should_1.default)(data[0].userId).be.exactly(authenticatedUser.id);
        (0, should_1.default)(data[0].groceryItemId).be.exactly(groceryItem[0].id);
        (0, should_1.default)(data[0].quantity).be.exactly(2);
    }));
    it('should update cart item and return 200', () => __awaiter(void 0, void 0, void 0, function* () {
        const groceryItem = yield createGroceryItem();
        createdGroceryItemIds.push(groceryItem[0].id);
        const cartItem = yield createCartItem(authenticatedUser.id, groceryItem[0].id, 2);
        createdCartItemsIds.push(cartItem.id);
        const response = yield (0, supertest_1.default)(index_1.default)
            .put('/cartItems/')
            .set('authorization', authenticatedUser.token)
            .send({ cartId: cartItem.id, updateObject: { quantity: 5 } });
        (0, should_1.default)(response.status).be.exactly(200);
        const data = response.body;
        (0, should_1.default)(data[0]).be.exactly(1);
    }));
    it('should delete cart item and return 200', () => __awaiter(void 0, void 0, void 0, function* () {
        const groceryItem = yield createGroceryItem();
        createdGroceryItemIds.push(groceryItem[0].id);
        const cartItem = yield createCartItem(authenticatedUser.id, groceryItem[0].id, 2);
        createdCartItemsIds.push(cartItem.id);
        const response = yield (0, supertest_1.default)(index_1.default)
            .delete(`/cartItems/${cartItem.id}`)
            .set('authorization', authenticatedUser.token);
        (0, should_1.default)(response.status).be.exactly(200);
        const data = response.body;
        (0, should_1.default)(data[0]).be.exactly(1);
    }));
});
describe('cartItems as admin', () => {
    let authenticatedUser;
    const createdUserIds = [];
    const createdGroceryItemIds = [];
    const createdCartItemsIds = [];
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        authenticatedUser = yield testHelper_1.default.createUserByRole('admin');
        createdUserIds.push(authenticatedUser.id);
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield deleteTestUsers(createdUserIds);
        yield deleteTestGroceryItems(createdGroceryItemIds);
        yield deleteTestCartItems(createdCartItemsIds);
    }));
    it('should not add a cart item and return 403', () => __awaiter(void 0, void 0, void 0, function* () {
        const groceryItem = yield createGroceryItem();
        createdGroceryItemIds.push(groceryItem[0].id);
        const response = yield (0, supertest_1.default)(index_1.default)
            .post('/cartItems/')
            .set('authorization', authenticatedUser.token)
            .send({ userId: authenticatedUser.id, groceryItemId: groceryItem[0].id, quantity: 2 });
        (0, should_1.default)(response.status).be.exactly(403);
    }));
    it('should not get cart items and return 403', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default)
            .get('/cartItems/')
            .set('authorization', authenticatedUser.token);
        (0, should_1.default)(response.status).be.exactly(403);
    }));
    it('should not update cart item and return 403', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default)
            .put('/cartItems/')
            .set('authorization', authenticatedUser.token)
            .send({ cartId: 1, updateObject: { quantity: 5 } });
        (0, should_1.default)(response.status).be.exactly(403);
    }));
    it('should not delete cart item and return 403', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default)
            .delete('/cartItems/1')
            .set('authorization', authenticatedUser.token);
        (0, should_1.default)(response.status).be.exactly(403);
    }));
});
function createGroceryItem() {
    return __awaiter(this, arguments, void 0, function* (count = 1) {
        const groceryItemObject = lodash_1.default.cloneDeep(grocery_json_1.default);
        groceryItemObject.quantity = 10;
        const promises = [];
        for (let i = 0; i < count; i++) {
            const groceryItem = groceryItems_1.default.create(groceryItemObject);
            promises.push(groceryItem);
        }
        const createdGroceryItems = yield Promise.all(promises);
        return createdGroceryItems.map((item) => item.toJSON());
    });
}
function createCartItem(userId, groceryItemId, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        const cartItem = yield cartItems_1.default.create({ userId, groceryItemId, quantity, deleted: 'false' });
        return cartItem.toJSON();
    });
}
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
function deleteTestCartItems(cartItemIds) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield cartItems_1.default.destroy({ where: { id: cartItemIds } });
    });
}
