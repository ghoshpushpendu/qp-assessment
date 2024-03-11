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
const user_json_1 = __importDefault(require("./samples/user.json"));
const user_store_1 = require("../src/database/store/user.store");
const lodash_1 = __importDefault(require("lodash"));
const helper_1 = require("../src/utils/helper");
const authHelper = {
    createUserByRole: (role) => __awaiter(void 0, void 0, void 0, function* () {
        const userObject = lodash_1.default.cloneDeep(user_json_1.default);
        userObject.role = role;
        userObject.username = lodash_1.default.random(0, 100000).toString();
        userObject.token = (0, helper_1.generateToken)();
        return yield user_store_1.userStore.createUser(userObject);
    }),
};
exports.default = authHelper;
