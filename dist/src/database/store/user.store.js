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
exports.userStore = void 0;
const helper_1 = require("../../utils/helper");
const user_1 = __importDefault(require("./../models/user"));
exports.userStore = {
    createUser: (requestedUser) => __awaiter(void 0, void 0, void 0, function* () {
        const resp = yield user_1.default.create(Object.assign(Object.assign({}, requestedUser), { password: (0, helper_1.createPasswordHash)(requestedUser.password) }));
        return resp.toJSON();
    }),
    getUserByToken: (token) => __awaiter(void 0, void 0, void 0, function* () {
        const resp = yield user_1.default.findOne({ where: { token: token } });
        return resp === null || resp === void 0 ? void 0 : resp.toJSON();
    }),
    getUserByUsernameAndPassword: (username, password) => __awaiter(void 0, void 0, void 0, function* () {
        const resp = yield user_1.default.findOne({ where: { username: username, password: (0, helper_1.createPasswordHash)(password) } });
        return resp === null || resp === void 0 ? void 0 : resp.toJSON();
    }),
    saveUserToken: (id, token) => __awaiter(void 0, void 0, void 0, function* () {
        return yield user_1.default.update({ token: token }, { where: { id: id } });
    }),
};
