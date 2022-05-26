const express = require('express');
const rp = require('request-promise');
const {User} = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const naver = {
    clientid: `${process.env.NAVER_CLIENT_ID}`, //REST API
    redirectUri	: 'http://localhost:3000/api/auth/naver/callback',
    client_secret : `${process.env.NAVER_CLIENT_SECRET}`,
    state : 'login'
};

// kakao login page URL --> HTML BUTTON CLICK --> ROUTER.KAKAOLOGIN
const  naverLogin = async (req,res) => {
    const naverAuthURL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naver.clientid}&redirect_uri=${naver.redirectUri}&state=${naver.state}`;
    res.redirect(naverAuthURL);
};

// naver register --> REDIRECT URI
const naverRegister = async (req,res) => {
    
    const code = req.query.code;
    const state = req.query.state;
    const naver_api_url = 'https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id='
     + naver.clientid + '&client_secret=' + naver.client_secret + '&redirect_uri=' + naver.redirectUri + '&code=' + code + '&state=' + state;

    var options = {
        url: naver_api_url,
        headers: {
            'X-Naver-Client-Id':naver.clientid,
            'X-Naver-Client-Secret': naver.client_secret
        }
     };
     const result = await rp.get(options);
    //  console.log('result->', result)
     const naverToken = JSON.parse(result).access_token;
    //  console.log('naverToken->', naverToken);

     const info_options = {
        url: 'https://openapi.naver.com/v1/nid/me',
        headers: {'Authorization': 'Bearer ' + naverToken}
    };

    const info_result = await rp.get(info_options);
  	// string 형태로 값이 담기니 JSON 형식으로 parse를 해줘야 한다.
    const info_result_json = JSON.parse(info_result).response;
    // console.log('info->', info_result_json);
    const userId = info_result_json.id;
    const userNick = info_result_json.nickname;

    // 가입여부 중복확인
    const existUser = await User.findOne({where: { userId: userId }});
    console.log("existUser-->", existUser);
  
    if (!existUser) {
      const from = "naver";
      await User.create({ userId, userNick, from });
    }
  
    const loginUser = await User.findOne({where: { userId: userId }});
    // console.log("loginUser-->", loginUser);
    var naverId = loginUser[0].userId
    var naverNick = loginUser[0].userNick
    const token = jwt.sign({ userId: loginUser[0].userId }, `${process.env.KEY}`);
    // console.log("token-->", token);
    res.status(200).send({
      token,
      naverId,
      naverNick
    });

};
module.exports = {naverLogin,naverRegister};
