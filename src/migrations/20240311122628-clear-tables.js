'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {


    await queryInterface.bulkDelete('cartItems', null, {});
    // Clear data from the groceryItems table
    await queryInterface.bulkDelete('groceryItems', null, {});
    // Clear data from the users table
    // await queryInterface.bulkDelete('users', null, {});

    // Clear data from other tables if needed
    // await queryInterface.bulkDelete('other_table_name', null, {});
  },

  down: async (queryInterface, Sequelize) => {
    // No need to define a down method for clearing data
    // This is typically a one-way operation
  }
};
