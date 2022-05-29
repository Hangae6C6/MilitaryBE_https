require('dotenv').config()

module.exports = {
  "development": {
    "username": "admin",
    "password": process.env.SEQUELIZE_PASSWORD,
    "database": "soliderchallengers",
    "host": "soliderchallengers.chitz0qkrhbx.us-east-1.rds.amazonaws.com",
    "dialect": "mysql"
  },
  "test": {
    "username": "admin",
    "password": process.env.SEQUELIZE_PASSWORD,
    "database": "soliderchallengers",
    "host": "soliderchallengers.chitz0qkrhbx.us-east-1.rds.amazonaws.com",
    "dialect": "mysql"
  },
  "production": {
    "username": "admin",
    "password": process.env.SEQUELIZE_PASSWORD,
    "database": "soliderchallengers",
    "host": "soliderchallengers.chitz0qkrhbx.us-east-1.rds.amazonaws.com",
    "dialect": "mysql"
  }
}
