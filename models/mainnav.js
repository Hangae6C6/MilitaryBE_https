'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MainNav extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MainNav.init({
    home: DataTypes.TINYINT,
    search: DataTypes.TINYINT,
    mypage: DataTypes.TINYINT
  }, {
    sequelize,
    modelName: 'MainNav',
  });
  return MainNav;
};