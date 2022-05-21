const express = require("express");
const router = express.Router();
const {
  mainPage,
  userChallenge,
  preTest,
  search,
  categoryClick,
  openChallenge1,
} = require("../controllers/main");
const authMiddleware = require("../middleware/authMiddleWare");

//메인페이지 로딩
router.get("/main", mainPage); //회원 + 비회원 둘다 가능

//회원 참여 챌린지
router.get("/main/challenge", authMiddleware, userChallenge); //회원만 가능

//사전테스트 결과
router.post("/main/preTest", authMiddleware, preTest); // 회원만 가능

router.post("/main/preTest", preTest); // 비회원도 가능

//검색
router.get("/search", search);

//카테고리 클릭시 조회수 증가
router.post("/categoryClick", categoryClick);

//챌린지 개설
router.post("/challenge", authMiddleware, openChallenge1);

module.exports = router;
