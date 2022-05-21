'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChallengeJoin extends Model {
    
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //Challenge 와 ChallengeJoin 연결 완료
      ChallengeJoin.belongsTo(models.Challenge, { foreignKey: 'challengeNum', sourceKey: 'userId', onDelete: 'CASCADE' });
      ChallengeJoin.hasMany(models.User, { foreignKey: 'userId', sourceKey: 'userId', onDelete: 'CASCADE'});
    }
  }
  ChallengeJoin.init({
    userId: DataTypes.STRING,
    challengeNum: DataTypes.STRING,
    progress: DataTypes.STRING,
    challengeJoinNumber:{
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    steps:DataTypes.JSON,
  }, {
    sequelize,
    modelName: 'ChallengeJoin',
  });
  return ChallengeJoin;
};