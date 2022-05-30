'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserChallenge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserChallenge.init({
    userId: {
      type:DataTypes.STRING,
      primaryKey:true,
    },
    userchallenegNum:DataTypes.INTEGER,
    challenegNum:DataTypes.STRING,
    challengeEndDate: DataTypes.STRING,
    challengeProgress: DataTypes.STRING,
    challengeTitle: DataTypes.STRING,
    challengeType: DataTypes.STRING,
    steps: DataTypes.JSON,

  }, {
    sequelize,
    modelName: 'UserChallenge',
  });
  return UserChallenge;
};
