"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserData", {
      startDate: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      endDate: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      armyCategory: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      rank: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      testResult: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      userId: {
        primaryKey: true,
        allowNull: true,
        type: Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserData");
  },
};