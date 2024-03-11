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
const cartItems_1 = __importDefault(require("./../models/cartItems"));
const cartItemsStore = {
    addCartItem: (userId, groceryItemId, quantity) => __awaiter(void 0, void 0, void 0, function* () {
        const item = yield cartItems_1.default.create({ userId, groceryItemId, quantity, deleted: 'false' });
        return item.toJSON();
    }),
    getCartItems: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        const items = yield cartItems_1.default.findAll({ where: { userId: userId, deleted: 'false' } });
        return items.map((item) => item.toJSON());
    }),
    updateCartItem: (cartId, updateObject) => __awaiter(void 0, void 0, void 0, function* () {
        return yield cartItems_1.default.update(Object.assign({}, updateObject), { where: { id: cartId, deleted: 'false' } });
    }),
    deleteCartItem: (cartId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield cartItems_1.default.update({ deleted: 'true' }, { where: { id: cartId, deleted: 'false' } });
    }),
    getCartItemById: (cartId) => __awaiter(void 0, void 0, void 0, function* () {
        const item = yield cartItems_1.default.findOne({ where: { id: cartId } });
        return item === null || item === void 0 ? void 0 : item.toJSON();
    })
};
exports.default = cartItemsStore;
