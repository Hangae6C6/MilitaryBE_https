"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      userId: {
        allowNull: true,
        primaryKey: true,
        type: Sequelize.STRING,
      },

      userNick: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      userPw: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      userTestData: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      from : {
        allowNull: true,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
        // default: Sequelize.now(),
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
        // default: Sequelize.now(),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Users");
  },
};
