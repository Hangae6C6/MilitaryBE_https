const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");
const httpPort = 3000;
const httpsPort = 4433;

//인증서 파트
const privateKey = fs.readFileSync(__dirname + "/private.key", "utf8");
const certificate = fs.readFileSync(__dirname + "/certificate.crt", "utf8");
const ca = fs.readFileSync(__dirname + "/ca_bundle.crt", "utf8");
const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

//https 미들웨어 정의
const app = express();
const app_low = express();

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

app_low.get("/", (req, res) => {
  res.send("mainPage");
});

app_low.get(
  "/.well-known/pki-validation/3F31E25B13B32EC5CF532FFC1868B24A.txt",
  (req, res) => {
    res.sendFile(
      __dirname +
        "/well-known/pki-validation/3F31E25B13B32EC5CF532FFC1868B24A.txt"
    );
  }
);

// app.listen(port, () => {
//   console.log(port, "번으로 서버가 켜졌어요!");
// });

http.createServer(app_low).listen(httpPort, () => {
  console.log("http 서버가 켜졌어요");
});

https.createServer(credentials, app).listen(httpsPort, () => {
  console.log("https 서버가 켜졌어요");
});
