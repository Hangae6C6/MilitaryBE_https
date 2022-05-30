"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.ChallengeJoin,{foreignKey: 'userId', sourceKey: 'userId', onDelete: 'CASCADE'})
      User.belongsTo(models.Challenge,{foreignKey: 'userId', sourceKey: 'userId', onDelete: 'CASCADE'})
      User.hasMany(models.UserData, { foreignKey: 'userId', sourceKey: 'userId', onDelete:'CASCADE' });
    }
  }
  User.init(
    {
      userId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      userNick: {
        type: DataTypes.STRING,
        unique: true,
      },
      userPw: DataTypes.STRING,
      userTestData: DataTypes.STRING,
      from: DataTypes.STRING,
      // socialtype: DataTypes.STRING,
      // socialId: DataTypes.STRING,
      // nickname: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
