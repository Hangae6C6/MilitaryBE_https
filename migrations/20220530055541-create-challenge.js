"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Challenges", {
      challengeNum: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      challengeProgress: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      challengeTitle: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      challengeType: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      challengeCnt: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      challengeViewCnt: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        allowNull: false,
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
      lastSavePage: {
        allowNull: false,
        type:Sequelize.INTEGER,
      },
      steps: {
        allowNull: false,
        type:Sequelize.JSON,
      },
      challengeStartDate: {
        allowNull: false,
        type:Sequelize.STRING,
      },
      challengeEndDate: {
        allowNull: false,
        type:Sequelize.STRING,
      },
      challengeLimitNum: {
        allowNull: false,
        type:Sequelize.STRING,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Challenges");
  },
};
