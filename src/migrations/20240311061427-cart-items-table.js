'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    try {
      await queryInterface.describeTable('cartItems');
      return Promise.resolve();
    } catch (error) {
      // If an error occurs, it means the table doesn't exist
      // If the table does not exist, create it
      return queryInterface.createTable('cartItems', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        groceryItemId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        deleted: {
          type: Sequelize.ENUM('true', 'false'),
          defaultValue: 'false',
          allowNull: false
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    // Drop the table if it exists
    return queryInterface.dropTable('cartItems');
  }
};
