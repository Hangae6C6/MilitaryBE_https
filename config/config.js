require('dotenv').config()

module.exports = {
  "development": {
    "username": "admin",
    "password": process.env.SEQUELIZE_PASSWORD,
    "database": "soldierChallengers_Node",
    "host": "soldierchallengers.ct6f9issjscy.us-east-1.rds.amazonaws.com",
    "dialect": "mysql"
  },
  "test": {
    "username": "admin",
    "password": process.env.SEQUELIZE_PASSWORD,
    "database": "soldierChallengers_Node",
    "host": "soldierchallengers.ct6f9issjscy.us-east-1.rds.amazonaws.com",
    "dialect": "mysql"
  },
  "production": {
    "username": "admin",
    "password": process.env.SEQUELIZE_PASSWORD,
    "database": "soldierChallengers_Node",
    "host": "soldierchallengers.ct6f9issjscy.us-east-1.rds.amazonaws.com",
    "dialect": "mysql"
  }
}
