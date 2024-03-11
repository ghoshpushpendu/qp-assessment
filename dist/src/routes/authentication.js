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
const helper_1 = require("../utils/helper");
const router = express_1.default.Router();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield user_store_1.userStore.getUserByUsernameAndPassword(username, password);
    if (user) {
        const token = (0, helper_1.generateToken)();
        try {
            yield user_store_1.userStore.saveUserToken(user.id, token);
            user.token = token;
            res.status(200).json({ user });
        }
        catch (e) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
}));
exports.default = router;
