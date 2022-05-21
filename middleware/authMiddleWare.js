const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const [authType, authToken] = (authorization || "").split(" ");

  if (!authToken || authType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
    return;
  }
  try {
    const { userId } = jwt.verify(authToken, process.env.KEY);
    User.findByPk(userId).then((user) => {
      res.locals.user = user;
      next();
    });
    
  } catch (error) {
    console.log("사용자 인증 미들웨어 에러");
    console.log(error);
    res.status(401).json({ result: "토큰이 유효하지 않습니다." });
    return;
  }
};
