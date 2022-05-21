const express = require("express");
const { UserData,User } = require("../models");

//사용자 정보 추가 기능
//썬더클라이언트 테스트 완료
const userOptioalData = async (req, res) => {
  const { startDate, endDate, armyCategory, rank } = req.body;
  const { userId } = res.locals.user; //저장

  //DB에 사용자 추가 데이터 저장
  // await UserData.create({ userId });

  // 중복 회원이 추가데이터 있는 경우 update로 수정하는 로직으로 진행! (수정필요)

  // console.log("11111111",userId);
  const existUser = await UserData.findOne({
    where: { userId: userId },
  });

  //  console.log("22222222",existUser);
  if (existUser) {
    await UserData.update(
      {
        startDate,
        endDate,
        armyCategory,
        rank,
      },
      { where: { userId: userId } }
    );
  } else if (!existUser) {
    const newexistUser = new UserData({
      startDate,
      endDate,
      armyCategory,
      rank,
      userId,
    });
    await newexistUser.save();
  }

  res.status(201).json({
    result: true,
    msg: "회원정보추가완료",
  });
};

//테스트결과 추가 기능
//썬더클라이언트 테스트 완료
const saveTestResult = async (req, res) => {
  const { testResult } = req.body;
  const { userId } = res.locals.user;

  const existUser = await UserData.findOne({
    where: { userId: userId },
  });

  if (existUser) {
    await UserData.update(
      {
        testResult,
      },
      { where: { userId: userId } }
    );
  } else if (!existUser) {
    const newexistUser = new UserData({
      testResult,
    });
    await newexistUser.save();
  }

  res.status(201).json({
    result: true,
    msg: "회원 테스트 결과 추가완료",
  });
};

//사용자 정보 수정 API
//썬더클라이언트 테스트 완료
const userDataModify = async(req,res)=> {
  if (!res.locals.user) {
    res.status(401).json({
      result:false,msg:"로그인 후 사용하세요",
    })
    return
}
  try {
    //계급이랑 닉네임
    const {userId} = req.query
    const {rank} = req.body
    const {userNick} = req.body
    const rankModify = await UserData.update({rank:rank},{where:{userId:userId}})
    const nickModify = await User.update({userNick:userNick},{where:{userId:userId}})
    res.status(200).json({result:true,msg:"사용자 정보 수정 완료입니다!",rankModify,nickModify})
  }catch(error) {
    console.log(error, "사용자 정보 수정 오류")
    res.status(400).json({result:false,msg:"사용자 정보 수정 오류입니다!"})
  }
}

module.exports = { userOptioalData, saveTestResult, userDataModify };

// SELECT `userId`, `userNick`, `userPw`, `userTestData`, `from`, `createdAt`, `updatedAt` FROM `Users` AS `User` WHERE `User`.`userId` = 'test10000';
// 선택 : userId ,nick , pw, testdata , from ,cr, up -> FROM(어디로부터) -> Users로부터 조건이 User에 userId
// INSERT INTO `UserData` (`userId`,`startDate`,`endDate`,`armyCategory`,`rank`,`createdAt`,`updatedAt`) VALUES (?,?,?,?,?,?,?);
// 삽입 : UserData (`userId`,`startDate`,`endDate`,`armyCategory`,`rank`,`createdAt`,`updatedAt` )  7개
// 에러가 난 이유 existUser.length  -> existUser로 바꾼이유 -> exisUser.length 로 쓸떄는 findAll 로 써서 existUser이 값을 찾아올수있었는데

// 화면에서 회원이 추가정보를 입력을해 ->  이미 가입되어있는사람인데 정보를 수정하고싶어서 다시 수정하는사람들을 위한게 17~20번까지 그게 아니라면 신규유저 21~24까지

// const { UserData } = require("../models");
//  //회원 추가정보 입력 라우터
//  const userOptioalData = async (req, res) => {
//       const { startDate, endDate, armyCategory, rank } = req.body;
//       //DB에 사용자 추가 데이터 저장
//       await UserData.create({ startDate, endDate, armyCategory, rank });
//        res.status(201).send({}); };
//        module.exports = { userOptioalData };

// function dateCalc(A,B){
//     var startDate = new Date(A);
//     var endDate = new Date(B);
//     var dateGap = endDate.getTime() - startDate.getTime();
//     return Math.ceil(dateGap/(1000 * 60 * 60 * 24));
//   }

// var x  = dateCalc('2022-04-20' , '2022-05-20');
// console.log('군생활 일수-->',x);
// var today = new Date();
// var y = dateCalc( today, '2022-05-20');
// console.log('전역까지 남은 일수-->',y);
// var z = (x-y)/x*100;
// console.log('군생활 ',z,'%');
