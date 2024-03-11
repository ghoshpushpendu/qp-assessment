"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const sequelize_1 = require("sequelize");
const GroceryItems = index_1.sequelize.define('groceryItems', {
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false
    },
    deleted: {
        type: sequelize_1.DataTypes.ENUM('true', 'false'),
        defaultValue: 'false',
        allowNull: false,
    },
});
GroceryItems.sync()
    .then(() => {
    console.log('GroceryItems table created');
})
    .catch(error => {
    console.error('Error creating GroceryItems table:', error);
});
exports.default = GroceryItems;
