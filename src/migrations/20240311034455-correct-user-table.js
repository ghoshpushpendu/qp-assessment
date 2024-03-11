'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    try {
      await queryInterface.describeTable('users');
    } catch (e) {
      await queryInterface.createTable('users', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        username: {
          type: Sequelize.STRING,
          allowNull: false
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false
        },
        role: {
          type: Sequelize.STRING,
          allowNull: false
        },
        token: {
          type: Sequelize.STRING,
          allowNull: true
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

    // Check if the index already exists in the database
    const indexExists = await queryInterface.sequelize.query(
      `SELECT EXISTS (
         SELECT 1
         FROM pg_indexes
         WHERE tablename = 'users'
           AND indexname = 'users_username'
       );`
    );
    const indexExistsResult = indexExists[0][0]['exists'];
    if (!indexExistsResult) {
      return queryInterface.addIndex('users', ['username'], {
        indexName: 'users_username',
        unique: true
      });
    } else {
      return Promise.resolve();
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeIndex('users', 'users_username');
  }
};
