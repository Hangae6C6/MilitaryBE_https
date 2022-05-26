const { transformAuthInfo } = require("passport");
const sequelize = require("sequelize");
const { Op } = require("sequelize");
const {
  Challenge,
  UserData,
  UserChallenge,
  ChallengeJoin,
  User,
} = require("../models");
const { or, and, like, eq } = sequelize.Op;

// challengeNum:challenge[0].challengeNum,
const detailPage = async (req, res) => {
  const { challengeNum } = req.query;
  try {
    if (challengeNum) {
      const detailChallenge = await Challenge.findOne({
        where: { challengeNum: challengeNum },
      });
      res.status(200).json({
        result: true,
        msg: "디테일페이지",
        challenge: detailChallenge,
      });
    } else {
      res.status(400).json({ result: false, msg: "detail1 가져오기 실패..." });
    }
  } catch (error) {
    console.log(error, "detail.js 가져오기 에서 오류남");
    res.status(400).json({ result: false, msg: "detail2 가져오기 실패..." });
  }
};

//  console.log(JSON.parse(detailChallenge.steps));
// var ckCnt=0;
// for(var i=0;i<detailChallenge.steps.length;i++){
//     if(detailChallenge.steps[i].isChecked){
//         ckCnt++;
//     };
// }
//  console.log("2222222",ckCnt);

// console.log(detailChallenge.challengeCnt);

// detailChallenge.challengeCnt = 5;
// console.log(detailChallenge.challengeCnt);

// 참여최대인원수가 6명 challengeLimitNum - challengeCnt = 남은자리
//   detailChallenge.a = 1;
//   console.log(detailChallenge);

const detailSteps = async (req, res) => {
  const { challengeNum, userId, stepNum } = req.query;
  let progress = 0;
  const challengeJoin = await ChallengeJoin.findOne({
    attributes: ["userId", "challengeNum", "steps"],
    where: { userId: userId, challengeNum: challengeNum },
  });
  // console.log("111111",challengeJoin.steps);
  // console.log("111233232",challengeJoin);
  var trueCnt = 0;
  for (let i = 0; i < challengeJoin.steps.length; i++) {
    // console.log("123",challengeJoin.steps);
    // console.log("1231221321313",challengeJoin.steps[i].stepNum==stepNum);
    if (challengeJoin.steps[i].stepNum == stepNum) {
      //변경해줘야 되는 스텝
      if (challengeJoin.steps[i].isChecked) {
        //변경해줘야되는 스텝의 isChecked가 트루인지 확인
        challengeJoin.steps[i].isChecked = false;
        // console.log("111",challengeJoin.steps[i].isChecked);
      } else {
        trueCnt++;
        challengeJoin.steps[i].isChecked = true;
        // console.log("222",challengeJoin.steps[i].isChecked);
      }
    } else {
      if (challengeJoin.steps[i].isChecked) {
        trueCnt++;
      }
    }
  }
  // console.log("123123123",challengeJoin.steps);
  await ChallengeJoin.update(
    { steps: challengeJoin.steps },
    { where: { userId: userId, challengeNum: challengeNum } }
  );
  progress = Math.round((trueCnt / challengeJoin.steps.length) * 100);
  // console.log("12321321321",progress);
  await ChallengeJoin.update(
    { progress: progress },
    { where: { userId: userId, challengeNum: challengeNum } }
  );
  res.status(200).json({
    result: true,
    msg: "스탭체크완료",
    challengeJoin,
  });
};
// 화면에서 클라이언트가 체크를 해서 오는 통신이 이곳이고 나는 업데이트를 해주기위해서 isChecked를 업데이트를 하는게 아니라
//  ChallengeJoin이라는 곳에 steps안에 있는 isCheked를 업데이트를 해줘야되는데

// ChallengeJoin 테이블에 내가 조건을 넣어서 내가 원하는 데이텉를 가져와야함
// 가져온것에서 steps에  true값을 바꿔줘야함 -> 화면에서 받은 특정한 스탭번호
// ChallengeJoin찍히면 성공 (로그인한 사람이 맞아야함)



//하나의 챌린지에 누가 참여하고있고 참여한 유저의 챌린지 진행현황 확인할수있는 기능
//한챌린지에 여러명이 참여할수있고 , 한명이 다양한 챌린지를 참여할수있다.
//개설한 유저의 정보가 아니라 참여하고있는 유저의 정보가 필요하다.
const detailJoin = async (req, res) => {
  if (!res.locals.user) {
    res.status(401).json({
      result: false,
      msg: "로그인 후 사용하세요",
    });
    return;
  }
  const { userId, challengeNum } = req.query; //로그인하고있는 유저
  const { challengeCnt } = req.body;
  try {
    //!! 추후 findOne -> findAll로 수정해야함 !!
    //동시성 이슈가 있을수도있다? => a라는 유저,b라는 유저가 72번 챌린지참여를 한번에했을때
    //DB에 중복해서 쌓일수도있다.
    const existUsers = await ChallengeJoin.findOne({
      where: {
        userId: userId,
        [Op.and]: [{ userId }, { challengeNum }],
      },
    });
    
    // console.log(existUsers)
    if (existUsers) {
      res
        .status(400)
        .json({ result: false, msg: "이미 참여하고있는 챌린지입니다." });
    } else if (!existUsers) {
      
      const steps = await Challenge.findOne({
        attributes: ["steps"],
        where: { challengeNum: challengeNum },
      });
      await Challenge.increment(
        { challengeCnt: 1 },
        { where: { challengeNum } }
      );
      let answer = [];
      for (let i = 0; i < steps.steps.length; i++) {
        if (steps.steps[i].isChecked === true) {
          answer.push(steps.steps[i].isChecked)
        }
      }
      let answer1 = answer.length / steps.steps.length * 100
      console.log(answer1)
      const userNick = await User.findOne({
        attributes:["userNick"],
        where:{userId:userId},
      })
      const challengejoin = await ChallengeJoin.create({
        userId,
        challengeNum,
        steps: steps.dataValues.steps,
        //컬럼명을 맞춰줘야한다...
        //그래야 생긴다....
        userNick:userNick.dataValues.userNick,
      });
      console.log(userNick.dataValues.userNick)
      res
        .status(201)
        .json({ result: true, msg: "챌린지리스트 성공", challengejoin , answer1 });
    } else {
      res
        .status(400)
        .json({ result: false, msg: "이미 참여하고있는 챌린지입니다." });
    }
  } catch (error) {
    console.log(error, "챌린지리스트 오류");
    res.status(400).json({ result: false, msg: "챌린지리스트 실패" });
  }
};

//하나의 챌린지에 누가 참여하고있고 참여한 유저의 챌린지 진행현황 확인할수있는 기능 query=userId
//sequelize join 성공 중첩완료
const detailJoinList_id = async (req, res) => {
  try {
    const { userId } = req.query;
    //중첩하여 원하는 데이터 항목 추출 완료
    if (userId) {
      const joinlist_id = await ChallengeJoin.findAll({
        attributes: ["userId", "challengeNum", "steps"],
        where: { userId: userId },
      });
      const onlychallengeNum = await ChallengeJoin.findAll({
        where: { userId: userId },
      });
      const onlychallengetable = await Challenge.findAll();
      const onlyusernick = await User.findAll();
      //challengeNum을 비교해서 include시킨다....?!
      let answer = [];
      for (let i = 0; i < onlychallengeNum.length; i++) {
        for (let j = 0; j < onlychallengetable.length; j++) {
          if (
            onlychallengeNum[i].challengeNum ==
            onlychallengetable[j].challengeNum
          ) {
            answer.push(onlychallengetable[j]);
          }
        }
      }
      let usernicklist = [];
      for (let i = 0; i < onlyusernick.length; i++) {
        if (onlyusernick[i].userId == userId) {
          usernicklist.push(onlyusernick[i].userNick);
        }
      }
      let usernicklist1 = usernicklist.join();
      res
        .status(200)
        .json({
          result: true,
          msg: "참여한 인원 조회 성공",
          joinlist_id,
          answer,
          usernicklist1,
        });
    } else {
      res.status(400).json({ result: false, msg: "참여한 인원 조회 실패" });
    }
  } catch (error) {
    console.log(error, "참여한 인원 조회 실패...");
    res.status(400).json({ result: false, msg: "참여한 인원 조회 실패" });
  }
};

//하나의 챌린지에 누가 참여하고있고 참여한 유저의 챌린지 진행현황 확인할수있는 기능 query=challengeNum
//sequelize join 성공 중첩완료
const detailJoinList_challengeNum = async (req, res) => {
  try {
    const { challengeNum } = req.query;
    // 중첩하여 원하는 데이터 항목 추출 완료
    if (challengeNum) {
      const joinlist_challengeNum = await ChallengeJoin.findAll({
        attributes: ["userId", "challengeNum", "steps"],
        where: { challengeNum: challengeNum },
        include: {
          model: User,
        },
      });
      res
        .status(200)
        .json({
          result: true,
          msg: "참여한 인원 조회 성공",
          joinlist_challengeNum,
        });
    } else {
      res.status(400).json({ result: false, msg: "참여한 인원 조회 실패!" });
    }
  } catch (error) {
    console.log(error, "참여한 인원 조회 실패...");
    res.status(400).json({ result: false, msg: "참여한 인원 조회 실패" });
  }
};

//참여하고있는 챌린지 나가기
//데이터 삭제 완료
const detailJoinout = async (req, res) => {
  const { userId, challengeNum } = req.query;
  try {
    const challengeout = await ChallengeJoin.destroy({
      where: { userId: userId, challengeNum: challengeNum },
    });
    await Challenge.decrement({ challengeCnt: 1 }, { where: { challengeNum } });
    res.status(200).json({ result: true, msg: "챌린지 나가기 성공" });
  } catch (error) {
    console.log(error, "챌린지 나가기에서 오류남");
    res.status(400).json({ result: false, msg: "챌린지 나가기 실패" });
  }
};


//짬킹성영형님 요청건!....ranking!!
const challengeRank = async(req,res)=> {
  const {challengeNum} = req.query
  try {
    const rank = await ChallengeJoin.findAll({
      attributes:['userId','userNick','progress'],
      where:{challengeNum}
    })
    res.status(200).json({result:true,msg:"챌린지 랭킹 성공",rank})
  }catch (error) {
    console.log(error)
    res.status(400).json({result:false,msg:"챌린지 랭킹 실패"})
  }
}

//인원수 limit ->  체크해주기

// 참가할때마다 참가자 늘려주기

module.exports = {
  detailPage,
  detailJoin,
  detailJoinList_id,
  detailJoinList_challengeNum,
  detailJoinout,
  detailSteps,
  challengeRank,
};
