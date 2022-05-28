const express = require("express");
const router = express.Router();
const {
    detailPage,
    detailJoin,
    detailJoinList_id,
    detailJoinList_challengeNum,
    detailJoinout,
    detailSteps,
    challengeRank
} = require("../controllers/detail");
const authMiddleware = require("../middleware/authMiddleWare");

//디테일페이지 가져오기 기능
//썬더클라이언트 테스트 완료(정대규)
router.get("/challengeDetail", authMiddleware, detailPage);

//하나의 챌린지에 누가 참여하고있고 참여한 유저의 챌린지 진행현황 확인할수있는 기능
//썬더클라이언트 테스트 완료(황인호)
router.post('/challengeJoin',authMiddleware, detailJoin);

//챌린지 참여한 유저 및 챌린지 진행 현황 확인 기능=query(userId)
//썬더클라이언트 테스트 완료(황인호)
router.get('/challengeJoin',authMiddleware, detailJoinList_id);

//챌린지 참여한 유저 및 챌린지 진행 현황 확인 기능=query(challengeNum)
//썬더클라이언트 테스트 완료(황인호)
router.get('/challengeJoinBychallengeNum',authMiddleware, detailJoinList_challengeNum);

//참여중인 챌린지 나가기
//썬더클라이언트 테스트 완료(황인호)
router.delete('/challengeout',authMiddleware, detailJoinout);

//첼린지상세페이지 step 
//썬더클라이언트 테스트 완료(정대규)
router.post('/challengeStep',authMiddleware, detailSteps);

//챌린지 Ranking
//썬더클라이언트 테스트 완료(황인호)
router.get('/challengeRanking',authMiddleware,challengeRank)

module.exports = router;
