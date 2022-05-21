const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const winston = require("winston");
const hpp = require("hpp");
const helmet = require("helmet");
const html = "<script>location.href = 'https://gilbut.co.kr'</script>";
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
console.log(sanitizeHtml(html));

//인증서 불러오기
const privateKey = fs.readFileSync(__dirname + "/private.key", "utf8");
const certificate = fs.readFileSync(__dirname + "/certificate.crt", "utf8");
const ca = fs.readFileSync(__dirname + "/ca_bundle.crt", "utf8");
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
  // cors: {
  //   origin: "http://localhost:3000", //여기에 명시된 서버만 내서버로 연결을 허용
  //   methods: ["GET", "POST"],
  // },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  socket.emit("msg", `${socket.id} 입장하셨습니다.`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.onAny((eventName, ...args) => {
    console.log(eventName);
  });

  socket.on("msg", function (data) {
    console.log(socket.id, data);

    socket.emit("msg", `Server : "${data}" 받았습니다.`);
  });

  socket.emit("send_message", `${socket.id} 입장하셨습니다.`);

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("leave_room", (room) => {
    console.log("???");
    socket.leave(room);
    console.log(`${socket.id}님께서 나가셨습니다.`);
  });

  socket.on("disconnect", () => {
    console.log("나갔니?");
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
app.use(cors());

app.get("/", (req, res) => {
  res.send("mainPage");
});

app.get(
  "/.well-known/pki-validation/3F31E25B13B32EC5CF532FFC1868B24A.txt",
  (req, res) => {
    res.sendFile(
      __dirname +
        "/well-known/pki-validation/3F31E25B13B32EC5CF532FFC1868B24A.txt"
    );
  }
);

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

// app.listen(port, () => {
//   console.log(port, "번으로 서버가 켜졌어요!");
// });

http.createServer(app_low).listen(httpPort, () => {
  console.log("http 서버가 켜졌어요");
});

https.createServer(credentials, app).listen(httpsPort, () => {
  console.log("https 서버가 켜졌어요");
});
