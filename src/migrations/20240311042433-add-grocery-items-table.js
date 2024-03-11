'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    try {
      await queryInterface.describeTable('groceryItems');
      return Promise.resolve();
    } catch (error) {
      // If an error occurs, it means the table doesn't exist
      // If the table does not exist, create it
      return queryInterface.createTable('groceryItems', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        price: {
          type: Sequelize.FLOAT,
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
    return queryInterface.dropTable('groceryItems');
  }
};
