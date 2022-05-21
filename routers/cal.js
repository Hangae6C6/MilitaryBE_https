const express = require('express')
const router = express.Router()
const authMiddleWare = require('../middleware/authMiddleWare')
const {endDay} = require('../controllers/cal')

//남은 일수 가져오기 MySQL
router.get("/endDay", authMiddleWare,endDay);

module.exports = router
