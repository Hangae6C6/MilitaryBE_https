const { Challenge, User, ChallengeJoin, Test, MainNav } = require("../models");
const sequelize = require("sequelize");
const { or, and, like, eq } = sequelize.Op;

//공백 , 최소 , 최대 유효성체크
// function strCheck(str,min,max,type){
//   const result = {result:true , msg:""};
//   if(str===undefined || str===null || str===""){
//     result=false;
//     msg=type+" 값이 공백입니다.";
//     return result;
//   }else if(str.length>max){
//     result=false;
//     msg=type+" 값이 최대 입력 값보다 큽니다.";
//     return result;
//   }else if(str.length<min){
//     result=false;
//     msg=type+" 값이 최소 입력 값보다 작습니다.";
//     return result;
//   }
//   return result;
// }

//메인페이지 챌린지 보여주기 라우터 (회원, 비회원 구분X)
const mainPage = async (req, res) => {
  console.log("-------->msg")
  const challenge = await Challenge.findAll();
  return res.status(201).json(challenge);
};

//로그인한 회원의 챌린지 현황 보여주기 라우터
//회원이 진행중인 모든 챌린지의 평균 진행률
const userChallenge = async (req, res) => {
  const { userId } = req.query;

  try {
    console.log(userId);
    const challenge = await ChallengeJoin.findAll({
      where: { userId: userId },
    });
    // console.log(challenge.length);
    // console.log("challenge : ", challenge[0].dataValues.progress);
    let sum = 0;
    for (let i = 0; i < challenge.length; i++) {
      sum += parseInt(challenge[i].dataValues.progress);
    }

    let totalChallengeProgress = Math.round(sum / challenge.length);
    // // console.log("progressSum: ", sum);
    // console.log("progressAvg: ", totalChallengeProgress);
    return res.status(201).json({ userId, totalChallengeProgress });
  } catch (error) {
    console.log(error, "메인페이지 토탈챌린지 진행률 가져오기 에러");
    res.status(400).json({
      result: false,
      msg: "메인페이지 토탈챌린지 진행률 가져오기 에러",
    });
  }
};

//사전 테스트 입력 라우터
const preTest = async (req, res) => {
  const userTestData = req.body;
  const { userId } = res.locals.user;

  //DB에 사용자 id에 따라 업데이트
  await User.update(userTestData, {
    where: {
      userId: userId,
    },
  });
  res.status(201).send({});
};


//테스트 
// const preTest1 = async (req,res) => {
//   const {userId} = req.query
//   const userData = await UserData.findOne({
//     where: { userId : userId },
//   });
//   const ck = true;
//   if(!userData){
//     ck=false;
//   }
//   res.status(200).json({
//     result:ck
//   });
// };

//검색기능 라우터
const search = async (req, res) => {
  let { keyword } = req.query;
  console.log(req.query);

  //검색어 없는 경우 예외처리
  if (!keyword.length) {
    return res.status(400).json("검색어를 입력해주세요.");
  }

  //검색어 입력시 타이틀/타입에서 해당 검색어로 검색
  const searchChallenge = await Challenge.findAll({
    where: {
      [or]: [
        { challengeTitle: { [like]: `%${keyword}%` } },
        { challengeType: { [like]: `%${keyword}%` } },
      ],
    },
  });

  //검색어와 일치하는 챌린지 없는 경우 예외처리
  if (searchChallenge.length === 0) {
    return res
      .status(401)
      .json({ message: "검색과 일치하는 챌린지가 없습니다." });
  }
  console.log("searchChallenge: ", searchChallenge);
  return res.status(201).json(searchChallenge);
};

//카테고리 클릭시 조회수 증가 라우터
const categoryClick = async (req, res) => {
  const { challengeNum } = req.query;
  let challengeViewCnt = req.body;
  const clickedChallenge = await Challenge.findOne({
    where: { challengeNum },
  });

  await Challenge.increment(
    { challengeViewCnt: 1 },
    { where: { challengeNum } }
  );
  // console.log(clickedChallenge.dataValues.challengeViewCnt);
  res.status(201).send({});
};

//챌린지개설
const openChallenge1 = async (req, res) => {
  // const { userId } = res.locals.user;
  const { userId } = req.query;

  const {
    challengeTitle, // 최대 글자수 7개
    challengeType, // 비어있으면 안되게
    challengeStartDate, // 숫자만 쓸수있게  월 - 일 - 년도 "-" 값을 넣어주세요  ! 20-05-2022
    challengeEndDate, // 숫자만 쓸수있게 앞에2개쓰게
    steps, // max 10자 빈값안되고 , 널값도 안되고, 글자는 2자 이상!
    challengeLimitNum, // 최소인원수 2명이상
  } = req.body.challenges;

  //벨리데이션체크
  // const checTitledLen = /^.{2,10}$/;
  // const checkStepLen = /^.{2,10}$/;
  // const dateExp = /^(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])-(19|20)\d{2}$/;

  // if (
  //   challengeTitle === "" ||
  //   challengeTitle === undefined ||
  //   challengeTitle === null
  // ) {
  //   res.status(400).json({
  //     msg: "챌린지타이틀을 입력하세요",
  //   });
  //   return;
  // } else if (!checTitledLen.test(challengeTitle)) {
  //   res.status(401).json({
  //     msg: "챌린지타이틀은 2~10자 입니다.",
  //   });
  //   return;
  // } else if (
  //   challengeType === "" ||
  //   challengeType === undefined ||
  //   challengeType === null
  // ) {
  //   res.status(400).json({
  //     msg: "챌린지타입을 선택해주세요",
  //   });
  //   return;
  // } else if (
  //   challengeStartDate === "" ||
  //   challengeStartDate === undefined ||
  //   challengeStartDate === null
  // ) {
  //   res.status(400).json({
  //     msg: "시작일을 입력하세요.",
  //   });
  //   return;
  // } else if (!dateExp.test(challengeStartDate)) {
  //   res.status(400).json({
  //     msg: "시작일의형태를 맞춰주세요(MM-DD-YYYY)",
  //   });
  //   return;
  // } else if (
  //   challengeEndDate === "" ||
  //   challengeEndDate === undefined ||
  //   challengeEndDate === null
  // ) {
  //   res.status(400).json({
  //     msg: "종료일을 입력하세요.",
  //   });
  //   return;
  // } else if (!dateExp.test(challengeEndDate)) {
  //   res.status(400).json({
  //     msg: "종료일의형태를 맞춰주세요(MM-DD-YYYY)",
  //   });
  //   return;
  // } else if (challengeLimitNum <= 2) {
  //   res.status(400).json({
  //     msg: "최소인원수는 2명이상입니다.",
  //   });
  //   return;
  // }

  // if (steps.length == 0) {
  //   res.status(400).json({
  //     msg: "스텝을 최소 1개 이상 입력해주세요",
  //   });
  //   return;
  // } else {
  //   for (var i = 1; i < steps.length; i++) {
  //     var content = steps[i].stepContent;
  //     if (content == "" || content == null || content == undefined) {
  //       res.status(400).json({
  //         msg: i + 1 + "번째 스텝의 컨텐츠를 입력해주세요",
  //       });
  //       return;
  //     } else if (!checkStepLen.test(content)) {
  //       res.status(400).json({
  //         msg: "챌린지스탭컨텐츠는 2~10자 입니다.",
  //       });
  //       return;
  //     }
  //   }
  // }

  // challengeNum은 자동생성,

  // steps data - > steps = [{a:1,b:2,c:3},{a:3,b:4}];

  //챌린지에 대한 vali
  // var stepsStr = "";
  // for(var i=0;i<steps.length;i++){
  //   console.log('steps[i]--->',steps[i]);

  //   stepsStr+=JSON.stringify(steps[i]);  // stepStr+=
  //   if(steps.length-1 !=i){
  //     stepsStr+='|';
  //   }
  // }

  //stepsStr - > {a:1,b:2}|{a:3,b:4}
  //이상태로 디비에 저장이 됨

  await Challenge.create({
    challengeEndDate,
    challengeStartDate,
    challengeType,
    challengeTitle,
    userId,
    steps,
    challengeLimitNum,
  });

  const challenge = await Challenge.findAll({
    order: [["challengeNum", "DESC"]], // detail 페이지 가기위해서
  });

  res.status(201).json({
    result: true,
    challengeNum: challenge[0].challengeNum,
    msg: "챌린지개설완료",
  });
};



//챌린지 참여하기 기능(미들웨어 거쳐야함))
const joinChallenge = async (req, res) => {
  if (!res.locals.user) {
    res.status(401).json({
      result: false,
      msg: "로그인 후 사용하세요",
    });
    return;
  }
  try {
    const { user } = res.locals.user;
    const { userId } = req.query;
    const statusChallenge = await Challenge.findAll(
      { userId },
      {
        where: {
          userId: userId,
        },
      }
    );
    if (challengeparticipate) {
      await Challenge.update({}, {});
    }
    res.status(200).json({ result: true, msg: "챌린지 참여하기 성공" });
  } catch (error) {
    console.log(error);
    console.log("main.js 챌린지 참여하기 -> 여기서 오류발생함");
    res.status(400).json({ result: false, msg: "챌린지 참여 실패..." });
  }
};

//챌린지 참여하기 취소 기능(미들웨어 거쳐야함))
const joinCancelChallenge = async (req, res) => {
  if (!res.locals.user) {
    res.status(400).json({ result: false, msg: "로그인 후 사용하세요" });
  }
  try {
    const { userId } = req.query;

    await Challenge.delete();
    res.stauts(200).json({ result: true, msg: "챌린치 취소 성공" });
  } catch (error) {
    console.log(error);
    console.log("main.js 챌린치 참여하기 취소 -> 여기서 에러발생함");
    res.status(400).json({ result: false, msg: "챌린지 취소 실패" });
  }
};

//메인페이지에서 테스트 조회한 사람 숫자 POST
const testCount = async (req, res) => {
  const { userId } = req.query;
  try {
    const click = await Test.findOne({ where: { userId } });
    await Test.increment({ testCount: 1 }, { where: { userId } });
    res.status(201).json({ result: true, msg: "챌린지", click });
  } catch (error) {
    console.log(error);
    res.status(400).json({ result: false, msg: "챌린지 테스트 조회수 실패" });
  }
};

//메인페이지에서 테스트 조회한 사람 숫자 GET
const testCountRead = async (req, res) => {
  try {
    const [countread] = await Test.findAll();
    res
      .status(200)
      .json({ result: true, msg: "테스트 조회수 가져오기 성공", countread });
  } catch (error) {
    console.log(error);
    res.status(400).json({ result: false, msg: "테스트 조회수 가져오기 실패" });
  }
};

// //메인페이지 클릭시 불들어오게하기 POST
// const iconClick = async (req, res) => {
//   const { btnNum } = req.query;
//   // console.log("--------->", req.query);
//   try {
//     // console.log(btnNum);
//     const btnResult = await MainNav.findOne({ where: { id: 1 } });
//     // console.log(
//     //   btnResult.dataValues.home,
//     //   btnResult.dataValues.search,
//     //   btnResult.dataValues.mypage
//     // );

//     if (btnNum == 1) {
//       console.log("11111111111");
//       await MainNav.update(
//         { home: 1, search: 0, mypage: 0 },
//         { where: { id: 1 } }
//       );
//     } else if (btnNum == 2) {
//       console.log("22222222222");
//       await MainNav.update(
//         { home: 0, search: 1, mypage: 0 },
//         { where: { id: 1 } }
//       );
//     } else if (btnNum == 3) {
//       console.log("33333333333");
//       await MainNav.update(
//         { home: 0, search: 0, mypage: 1 },
//         { where: { id: 1 } }
//       );
//     }
//     const clickedResult = await MainNav.findOne({ where: { id: 1 } });

//     res.status(201).json({ result: true, msg: "clicked Btn", clickedResult });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ result: false, msg: "fail to click" });
//   }
// };

// const iconClick2 = async (req, res) => {
//   try {
//     const [iconRead] = await MainNav.findAll();
//     res
//       .status(200)
//       .json({ result: true, msg: "Nav바 가져오기 성공", iconRead });
//   } catch (error) {
//     console.log(error);
//     res.status(400).json({ result: false, msg: "Nav바 가져오기 실패" });
//   }
// };




module.exports = {
  mainPage,
  userChallenge,
  categoryClick,
  preTest,
  search,
  openChallenge1,
  testCount,
  testCountRead,
};
