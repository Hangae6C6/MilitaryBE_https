const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");
const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(port, "번으로 서버가 켜졌어요!");
});
