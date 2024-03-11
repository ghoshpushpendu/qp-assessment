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
const supertest_1 = __importDefault(require("supertest"));
const lodash_1 = __importDefault(require("lodash"));
const user_1 = __importDefault(require("../../src/database/models/user"));
const user_json_1 = __importDefault(require("./../samples/user.json"));
const should_1 = __importDefault(require("should"));
const index_1 = __importDefault(require("./../../src/index"));
const testHelper_1 = __importDefault(require("./../testHelper"));
describe("User", () => {
    const createUserIds = [];
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield deleteTestUsers(createUserIds);
    }));
    it("should not create a user and should return 401 authorised", () => __awaiter(void 0, void 0, void 0, function* () {
        const userObject = lodash_1.default.cloneDeep(user_json_1.default);
        const response = yield (0, supertest_1.default)(index_1.default).post("/user/").send(userObject);
        (0, should_1.default)(response.status).be.exactly(401);
    }));
    it("should create a user and return 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token, id } = yield testHelper_1.default.createUserByRole("admin");
        createUserIds.push(id);
        const userObject = lodash_1.default.cloneDeep(user_json_1.default);
        const response = yield (0, supertest_1.default)(index_1.default)
            .post("/user/")
            .set("authorization", token)
            .send(userObject);
        (0, should_1.default)(response.status).be.exactly(200);
        const data = response.body.user;
        (0, should_1.default)(data.username).be.exactly(user_json_1.default.username);
        createUserIds.push(data.id);
    }));
    it("should not create a duplicate user with name username", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token, id, username } = yield testHelper_1.default.createUserByRole("admin");
        createUserIds.push(id);
        const userObject = lodash_1.default.cloneDeep(user_json_1.default);
        userObject.username = username;
        const response = yield (0, supertest_1.default)(index_1.default)
            .post("/user/")
            .set("authorization", token)
            .send(userObject);
        (0, should_1.default)(response.status).be.exactly(500);
        (0, should_1.default)(response.body.error).be.exactly("Validation error");
    }));
    it("should not create a user if not admin", () => __awaiter(void 0, void 0, void 0, function* () {
        const { token, id } = yield testHelper_1.default.createUserByRole("user");
        createUserIds.push(id);
        const userObject = lodash_1.default.cloneDeep(user_json_1.default);
        const response = yield (0, supertest_1.default)(index_1.default)
            .post("/user/")
            .set("authorization", token)
            .send(userObject);
        (0, should_1.default)(response.status).be.exactly(403);
        (0, should_1.default)(response.body.error).be.exactly("Forbidden");
    }));
    function deleteTestUsers(userIds) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_1.default.destroy({ where: { id: userIds } });
        });
    }
});
