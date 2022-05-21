const express = require("express");
const router = express.Router();
const { signUp, login, loginCheck, logout } = require("../controllers/user");
const authMiddleware = require("../middleware/authMiddleWare");
require("dotenv").config();

//회원가입
router.post("/signUp", signUp);

//로그인
router.post("/login", login);

//로그인체크
router.get("/loginCheck", authMiddleware, loginCheck);

//로그아웃
//썬더클라이언트 확인 완료(황인호)
router.get("/logout", authMiddleware, logout);

module.exports = router;
