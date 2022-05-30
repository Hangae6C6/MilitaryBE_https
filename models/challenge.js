'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Challenge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //Challenge 와 ChallengeJoin 연결 완료
      Challenge.hasMany(models.ChallengeJoin, { foreignKey: 'challengeNum', sourceKey: 'userId', onDelete:'CASCADE' });
      Challenge.hasMany(models.User, { foreignKey: 'userId', sourceKey: 'userId', onDelete:'CASCADE' });
    }
  }
  Challenge.init({
    challengeNum: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
      challengeProgress: DataTypes.STRING, //(추가)
      challengeTitle: DataTypes.STRING,
      challengeType: DataTypes.STRING,
      challengeCnt: DataTypes.INTEGER,
      challengeViewCnt: DataTypes.INTEGER, //(추가)
      userId: DataTypes.STRING, 
      // isChecked:DataTypes.BOOLEAN,
      lastSavePage:DataTypes.INTEGER, // 원래 사용하려했지만 버림
      steps : DataTypes.JSON, //[{stepNum:int,stepContent,isChecked}] 이런식으로 들어옴
      challengeEndDate:DataTypes.STRING,
      challengeStartDate:DataTypes.STRING,
      challengeLimitNum:DataTypes.STRING, // detail페이지에서 쓸것 
  }, {
    sequelize,
    modelName: 'Challenge',
  });
  return Challenge;
};