const express = require('express');
const router = express.Router();
const {naverLogin,naverRegister} = require("../controllers/naver")

router.get("/auth/naver",naverLogin);

router.get("/auth/naver/callback",naverRegister);


module.exports = router;