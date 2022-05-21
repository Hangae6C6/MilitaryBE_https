const express = require("express");
const router = express.Router();
const { userOptioalData, saveTestResult, userDataModify } = require("../controllers/userData");
const authMiddleware = require("../middleware/authMiddleWare");
require("dotenv").config();

//사용자 정보 추가 기능
router.post("/userData", authMiddleware, userOptioalData);

//테스트결과 추가 기능
router.post("/userTest", authMiddleware, saveTestResult);

//사용자 정보 수정 기능
//썬더클라이언트 확인 완료(황인호)
router.put('/userModify', authMiddleware, userDataModify)

module.exports = router;
