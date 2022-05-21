const express = require('express');
const router = express.Router();
const {kakaoLogin,kakaoRegister} = require("../controllers/kakao")

router.get("/auth/kakao",kakaoLogin);

router.get("/auth/kakao/callback",kakaoRegister);

module.exports = router;