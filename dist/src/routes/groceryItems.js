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
const groceryItems_store_1 = __importDefault(require("./../database/store/groceryItems.store"));
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authenticatedUser = req.user;
    if (authenticatedUser.role !== 'admin') {
        const items = yield groceryItems_store_1.default.getAllItems();
        res.status(200).json({ items });
    }
    else {
        const items = yield groceryItems_store_1.default.getAllAvailableItems();
        res.status(200).json({ items });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authenticatedUser = req.user;
    if (authenticatedUser.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden' });
        return;
    }
    const groceryItem = req.body;
    try {
        const createdItem = yield groceryItems_store_1.default.createNewItem(groceryItem);
        res.status(200).json({ item: createdItem });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authenticatedUser = req.user;
    if (authenticatedUser.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden' });
        return;
    }
    const groceryItem = req.body;
    const id = req.params.id;
    try {
        const updatedItem = yield groceryItems_store_1.default.updateItemById(id, groceryItem);
        res.status(200).json({ item: updatedItem });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authenticatedUser = req.user;
    if (authenticatedUser.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden' });
        return;
    }
    const id = req.params.id;
    try {
        const deletedItem = yield groceryItems_store_1.default.deleteItemById(id);
        res.status(200).json({ item: deletedItem });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}));
exports.default = router;
