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
const express_1 = __importDefault(require("express"));
const cartItems_store_1 = __importDefault(require("../database/store/cartItems.store"));
const groceryItems_store_1 = __importDefault(require("../database/store/groceryItems.store"));
const router = express_1.default.Router();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authenticatedUser = req.user;
        if (authenticatedUser.role !== 'user') {
            res.status(403).send('Forbidden');
            return;
        }
        const { userId, groceryItemId, quantity } = req.body;
        // decrement the quantity of the grocery item in the groceryItems table
        const groceryItem = yield groceryItems_store_1.default.getItemById(groceryItemId);
        if (groceryItem.quantity < quantity) {
            res.status(400).send('Not enough quantity available');
            return;
        }
        yield groceryItems_store_1.default.updateItemById(groceryItemId, { quantity: groceryItem.quantity - quantity });
        const cartItem = yield cartItems_store_1.default.addCartItem(userId, groceryItemId, quantity);
        res.status(200).send(cartItem);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authenticatedUser = req.user;
        if (authenticatedUser.role !== 'user') {
            res.status(403).send('Forbidden');
            return;
        }
        const userId = authenticatedUser.id;
        const cartItems = yield cartItems_store_1.default.getCartItems(userId);
        res.status(200).send(cartItems);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
router.put('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authenticatedUser = req.user;
        if (authenticatedUser.role !== 'user') {
            res.status(403).send('Forbidden');
            return;
        }
        const { cartId, updateObject } = req.body;
        const cartItem = yield cartItems_store_1.default.getCartItemById(cartId);
        const updatedCartItem = yield cartItems_store_1.default.updateCartItem(cartId, updateObject);
        if (updateObject.quantity) {
            //TODO : check the operation is not making grocery item quantity negative
            // increment the quantity of the grocery item in the groceryItems table
            const groceryItem = yield groceryItems_store_1.default.getItemById(cartItem.groceryItemId);
            yield groceryItems_store_1.default.updateItemById(cartItem.groceryItemId, { quantity: groceryItem.quantity + cartItem.quantity - updateObject.quantity });
        }
        res.status(200).send(updatedCartItem);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authenticatedUser = req.user;
        if (authenticatedUser.role !== 'user') {
            res.status(403).send('Forbidden');
            return;
        }
        const cartId = req.params.id;
        const cartItem = yield cartItems_store_1.default.getCartItemById(cartId);
        const deletedCartItem = yield cartItems_store_1.default.deleteCartItem(cartId);
        // increment the quantity of the grocery item in the groceryItems table
        const groceryItem = yield groceryItems_store_1.default.getItemById(cartItem.groceryItemId);
        yield groceryItems_store_1.default.updateItemById(cartItem.groceryItemId, { quantity: groceryItem.quantity + cartItem.quantity });
        res.status(200).send(deletedCartItem);
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
exports.default = router;
