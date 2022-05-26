const express = require("express");
const router = express.Router();
const {
  mainPage,
  userChallenge,
  preTest,
  search,
  categoryClick,
  openChallenge1,
  testCount,
  testCountRead,
  iconClick,
  iconClick2
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

//테스트 페이지 조회수 증가 기능
//썬더클라이언트 테스트 완료(황인호)
router.post("/main/testCount", testCount);

//테스트 페이지 조회수 가져오기
//썬더클라이언트 테스트 완료(황인호)
router.get("/main/testCountRead", testCountRead);

//클릭시 불들어옴(post)
router.post("/main/iconclick", iconClick);

//클릭시 불들어옴(get)
router.get("/main/iconclickRead", iconClick2);

module.exports = router;
