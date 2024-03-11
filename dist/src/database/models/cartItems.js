"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const sequelize_1 = require("sequelize");
const groceryItems_1 = __importDefault(require("./groceryItems"));
const user_1 = __importDefault(require("./user"));
const cartItems = index_1.sequelize.define('cartItems', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    groceryItemId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    deleted: {
        type: sequelize_1.DataTypes.ENUM('true', 'false'),
        defaultValue: 'false',
        allowNull: false,
    },
});
cartItems.belongsTo(groceryItems_1.default, { foreignKey: 'groceryItemId' });
cartItems.belongsTo(user_1.default, { foreignKey: 'userId' });
cartItems.sync()
    .then(() => {
    console.log('cartItems table created');
})
    .catch(error => {
    console.error('Error creating cartItems table:', error);
});
exports.default = cartItems;
