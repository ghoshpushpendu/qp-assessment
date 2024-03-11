"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const sequelize_1 = require("sequelize");
const User = index_1.sequelize.define('user', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true
    }
});
User.sync().then(() => {
    console.log('User table created');
});
exports.default = User;
