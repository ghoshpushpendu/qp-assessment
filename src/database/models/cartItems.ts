import { sequelize } from "../index";
import { DataTypes } from "sequelize";
import GroceryItems from "./groceryItems";
import Users from "./user";

const cartItems = sequelize.define('cartItems', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    groceryItemId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    deleted: {
        type: DataTypes.ENUM('true', 'false'),
        defaultValue: 'false',
        allowNull: false,
    },
});

cartItems.sync()
    .then(() => {
        console.log('cartItems table created');
    })
    .catch(error => {
        console.error('Error creating cartItems table:', error);
    });

export default cartItems;



