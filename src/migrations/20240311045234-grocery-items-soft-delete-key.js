'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    let tableExists;
    let table;
    try {
      // Check if the groceryItems table exists
      table = await queryInterface.describeTable('groceryItems');
      tableExists = true;
    } catch (error) {
      // Table does not exist
      tableExists = false;
    }

    if (tableExists && !table.deleted) {
      // If table exists, add the 'deleted' field
      return queryInterface.addColumn('groceryItems', 'deleted', {
        type: Sequelize.ENUM('true', 'false'),
        defaultValue: 'false',
        allowNull: false
      });
    } else {
      // Table does not exist, do nothing
      return Promise.resolve();
    }
  },

  async down(queryInterface, Sequelize) {
    // Remove the 'deleted' field
    return queryInterface.removeColumn('groceryItems', 'deleted');
  }
};
