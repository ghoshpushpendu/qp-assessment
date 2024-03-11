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
const user_store_1 = require("../database/store/user.store");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    const user = req.user;
    res.status(200).json({ user });
});
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    const authenticatedUser = req.user;
    if (authenticatedUser.role !== 'admin') {
        res.status(403).json({ error: 'Forbidden' });
        return;
    }
    try {
        const createdUser = yield user_store_1.userStore.createUser(user);
        res.status(200).json({ user: createdUser });
    }
    catch (e) {
        res.status(500).json({ error: e.message });
    }
}));
exports.default = router;
