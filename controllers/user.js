const { User } = require("../models");
const { Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

// 회원가입
const signUp = async (req, res) => {
  const { userId, userPw, userNick, userPwCheck } = req.body;
  // console.log(userId, userPw, userNick, userPwCheck);

  // Validation Check
  let userNickReg = /^([a-zA-Z0-9ㄱ-ㅎ|ㅏ-ㅣ|가-힣]).{2,15}$/; //2~15자 한글,영문,숫자
  let userPwReg = /^(?=.*[a-zA-Z])(?=.*\d)[\w]{8,}$/; //8자 이상 영문+숫자

  const existUsers = await User.findAll({
    where: { [Op.or]: [{ userId }, { userNick }] },
  });

  if (userId === "" || userId === undefined || userId === null) {
    res.status(400).json({
      errorMessage: "아이디를 입력하세요.",
    });
    return;
  } else if (userNick === "" || userNick === undefined || userNick === null) {
    res.status(400).json({
      errorMessage: "닉네임을 입력하세요.",
    });
    return;
  } else if (!userNickReg.test(userNick)) {
    res.status(400).json({
      errorMessage: "닉네임은 2~15자, 한글,영문 및 숫자만 가능합니다.",
    });
    return;
  } else if (existUsers.length) {
    res.status(400).json({
      errorMessage: "이미 가입된 아이디 또는 닉네임 입니다.",
    });
    return;
  } else if (userPw === "" || userPw === undefined || userPw === null) {
    res.status(400).json({
      errorMessage: "비밀번호를 입력하세요.",
    });
    return;
  } else if (
    userPwCheck === "" ||
    userPwCheck === undefined ||
    userPwCheck === null
  ) {
    res.status(400).json({
      errorMessage: "비밀번호 확인란을 입력하세요.",
    });
    return;
  } else if (!userPwReg.test(userPw)) {
    res.status(400).json({
      errorMessage: "4~15자, 영문 및 숫자만 가능합니다.",
    });
    return;
  }
  // console.log('111');
  // bcrypt module -> 암호화
  // 10 --> saltOrRound --> salt를 10번 실행 (높을수록 강력)ß
  const from = "webSite";
  const hashed = bcrypt.hashSync(userPw, 10);
  await User.create({ userId, userNick, userPw: hashed, from });
  res.status(200).json({
    result: "true",
    msg: "회원가입성공",
  });
};

// 로그인
const login = async (req, res) => {
  const { userId, userPw } = req.body;
  // console.log(req); 잘받아고
  // const hashed =  bcrypt.hashSync(userPw, 10);
  // console.log("12321312213123",hashed);
  const user = await User.findOne({ where: { userId: userId } });
  console.log(userId);

  const tokenOptions = { expiresIn: "60000", issuer: "soldierChallengers" };

  // body passowrd = unHashPassword -->true
  const unHashPw = bcrypt.compareSync(userPw, user.userPw);

  if (user.userId !== userId || unHashPw === false) {
    res.status(401).json({
      msg: "아이디 혹은 비밀번호가 안맞습니다.",
    });
  }

  const loginToken = jwt.sign(
    { userId: user.userId },
    process.env.KEY,
    tokenOptions
  );

  res.json({
    loginToken,
    userId,
    msg: "로그인에 성공했습니다.",
  });
};

// 로그인체크
// 체크
const loginCheck = async (req, res) => {
  const { user } = res.locals;
  res.status(200).json({
    user,
  });
};

//로그아웃 기능
//썬더클라이언트 테스트 완료
const logout = async(req,res)=> {
  const {userId} = req.query
  if (userId) {
    return res.cookie("x_auth","").status(200).json({result:true,msg:'로그아웃 성공',userId})
  }else {
    res.status(400).json({result:false,msg:"로그아웃 실패"})
  }
}

module.exports = { signUp, login, loginCheck, logout };
