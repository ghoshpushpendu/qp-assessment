import { sequelize } from '../index';
import { DataTypes } from 'sequelize';

const GroceryItems = sequelize.define('groceryItems', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    deleted: {
        type: DataTypes.ENUM('true', 'false'),
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

export default GroceryItems;