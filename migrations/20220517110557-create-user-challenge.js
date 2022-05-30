'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserChallenge', {
      userId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      challenegNum: {
        type: Sequelize.INTEGER,
        autoIncrement: true
      },
      challengeEndDate: {
        type: Sequelize.STRING
      },
      challengeProgress: {
        type: Sequelize.STRING
      },
      challengeTitle: {
        type: Sequelize.STRING
      },
      challengeType: {
        type: Sequelize.STRING
      },
      step: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserChallenge');
  }
};