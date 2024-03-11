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
const should_1 = __importDefault(require("should"));
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("./../../src/index"));
const user_1 = __importDefault(require("../../src/database/models/user"));
const user_json_1 = __importDefault(require("./../samples/user.json"));
const helper_1 = require("../../src/utils/helper");
const lodash_1 = __importDefault(require("lodash"));
const Sinon = require("sinon");
const user_store_1 = require("../../src/database/store/user.store");
describe("Authentication", () => {
    const createUserIds = [];
    const userStoreMocker = Sinon.mock(user_store_1.userStore);
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield deleteTestUsers(createUserIds);
        Sinon.restore();
    }));
    function createTestUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const userObject = lodash_1.default.cloneDeep(user_json_1.default);
            userObject.password = (0, helper_1.createPasswordHash)(userObject.password);
            return yield user_1.default.create(userObject);
        });
    }
    ;
    function deleteTestUsers(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.default.destroy({ where: { id: userIds } });
        });
    }
    it("should not authenticate if user does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(index_1.default).post("/authenticate/").send({
            username: "user",
            password: "password"
        });
        (0, should_1.default)(response.status).be.exactly(401);
    }));
    it("should authenticate if user exists", () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield createTestUser();
        createUserIds.push(user.dataValues.id);
        const response = yield (0, supertest_1.default)(index_1.default).post("/authenticate/").send({
            username: user_json_1.default.username,
            password: user_json_1.default.password
        });
        const data = response.body.user;
        (0, should_1.default)(response.status).be.exactly(200);
        (0, should_1.default)(data.username).be.exactly(user_json_1.default.username);
        (0, should_1.default)(data.token).not.be.Null();
    }));
    it("should retunr 500 if user token cannot be saved", () => __awaiter(void 0, void 0, void 0, function* () {
        userStoreMocker.expects("saveUserToken").once().throws(new Error("Error"));
        const user = yield createTestUser();
        createUserIds.push(user.dataValues.id);
        const response = yield (0, supertest_1.default)(index_1.default).post("/authenticate/").send({
            username: user_json_1.default.username,
            password: user_json_1.default.password
        });
        (0, should_1.default)(response.status).be.exactly(500);
    }));
});
