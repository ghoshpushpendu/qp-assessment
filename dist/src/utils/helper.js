"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.createPasswordHash = void 0;
const createPasswordHash = (password) => {
    return Buffer.from(password).toString('base64');
};
exports.createPasswordHash = createPasswordHash;
const generateToken = () => {
    return Math.random().toString(36).substring(2);
};
exports.generateToken = generateToken;
