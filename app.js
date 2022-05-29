const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const winston = require("winston");
const { sequelize } = require("./models");
const hpp = require("hpp");
const helmet = require("helmet");
// const html = "<script>location.href = 'https://gilbut.co.kr'</script>";
const cors = require("cors");

const app = express();
const app_low = express();

const { Server } = require("socket.io");
const server = http.createServer(app);
const passport = require("passport");
const session = require("express-session");
const sanitizeHtml = require("sanitize-html");

const httpPort = 3000;
const httpsPort = 4433;

// console.log(sanitizeHtml(html));
app.use(cors());
sequelize 
  .sync({ force: false }) 
  .then(() => { console.log("데이터베이스 연결 성공"); 
  }) 
  .catch((err) => {
    console.error(err); 
  });

 // db연결
  sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

//인증서 불러오기
const privateKey = fs.readFileSync(__dirname + "/pizzaboy_shop.key", "utf8");
const certificate = fs.readFileSync(__dirname + "/pizzaboy_shop__crt.pem", "utf8");
const ca = fs.readFileSync(__dirname + "/pizzaboy_shop__ca.pem", "utf8");
const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

//https 미들웨어 정의

//라우터 불러오기
const userRouter = require("./routers/user");
const userdataRouter = require("./routers/userdata");
const mainRouter = require("./routers/main");
const authNaverRouter = require("./routers/auth_naver");
const mypageRouter = require("./routers/mypage");
const kakaoRouter = require("./routers/kakaoLogin");
const calRouter = require("./routers/cal");
const detailRouter = require("./routers/detail");

// 접속 로그 남기기
const requestMiddleware = (req, res, next) => {
  console.log(
    "[Ip address]:",
    req.ip,
    "[method]:",
    req.method,
    "Request URL:",
    req.originalUrl,
    " - ",
    new Date().toISOString()
  );
  next();
};

//https 리다이렉션
//app_low : http 전용 미들웨어
app_low.use((req, res, next) => {
  if (req.secure) {
    next();
  } else {
    const to = `https://${req.hostname}:${httpPort}${req.url}`;
    console.log(to);
    res.redirect(to);
  }
});

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });

  socket.on("leave-room", (roomName, done) => {
    socket.leave(roomName);
    done();
    console.log("나 나갔어");
    // const rooms = getUserRooms();
    // if (!rooms.includes(roomName)) {
    io.emit("remove-room", roomName);
    console.log("방 삭제되었음");
  });
});

//미들웨어 사용
app.use(session({ secret: "solider challenge project" }));
app.use(passport.initialize());
app.use(passport.session());
app.use(session());
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(requestMiddleware);
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("combined"));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(hpp());

app.get("/", (req, res) => {
  res.send("mainPage");
});

// app.get(
//   "/.well-known/pki-validation/479CA8BBE82722022860E04CE3AFF333.txt",
//   (req, res) => {
//     res.sendFile(
//       __dirname +
//         "/well-known/pki-validation/479CA8BBE82722022860E04CE3AFF333.txt"
//     );
//   }
// );

//라우터 연결
app.use("/api", [
  userRouter,
  authNaverRouter,
  userdataRouter,
  mainRouter,
  detailRouter,
  calRouter,
  mypageRouter,
  kakaoRouter,
]);

//에러 핸들러
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).send("Something Broke!");
});

// app.listen(3000, () => {
//   console.log(3000, "번으로 서버가 켜졌어요!");
// });

http.createServer(app_low).listen(httpPort, () => {
  console.log("http 서버가 켜졌어요");
});

https.createServer(credentials, app).listen(httpsPort, () => {
  console.log("https 서버가 켜졌어요");
});
