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
const sequelize_1 = require("sequelize");
const groceryItems_1 = __importDefault(require("./../models/groceryItems"));
const groceryItemsStore = {
    createNewItem: (groceryItem) => __awaiter(void 0, void 0, void 0, function* () {
        groceryItem.deleted = 'false';
        const createditem = yield groceryItems_1.default.create(groceryItem);
        return createditem.toJSON();
    }),
    updateItemById: (id, groceryItem) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedItem = yield groceryItems_1.default.update(groceryItem, {
            where: {
                id: id,
                deleted: 'false'
            }
        });
        return updatedItem;
    }),
    getItemById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const item = yield groceryItems_1.default.findOne({
            where: {
                id: id,
                deleted: 'false'
            }
        });
        return item === null || item === void 0 ? void 0 : item.toJSON();
    }),
    // soft deleting the grocery item
    deleteItemById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const deletedItem = yield groceryItems_1.default.update({
            deleted: 'true'
        }, {
            where: {
                id: id,
                deleted: 'false'
            }
        });
        return deletedItem;
    }),
    getAllAvailableItems: () => __awaiter(void 0, void 0, void 0, function* () {
        const items = yield groceryItems_1.default.findAll({
            where: {
                deleted: 'false',
                quantity: {
                    [sequelize_1.Op.gt]: 0
                }
            }
        });
        return items.map((item) => item.toJSON());
    }),
    getAllItems: () => __awaiter(void 0, void 0, void 0, function* () {
        const items = yield groceryItems_1.default.findAll({
            where: {
                deleted: 'false'
            }
        });
        return items.map((item) => item.toJSON());
    }),
};
exports.default = groceryItemsStore;
