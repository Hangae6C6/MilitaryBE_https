const express = require('express');
const rp = require('request-promise');
const {User} = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const kakao = {
    clientid: `${process.env.CLIENTED}`, //REST API
    redirectUri : 'http://localhost:3000/api/auth/kakao/callback' // 이따가 우리껄로 바꾸고 하기 
};

// kakao login page URL --> HTML BUTTON CLICK --> ROUTER.KAKAOLOGIN
const  kakaoLogin = async (req,res) => {
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakao.clientid}&redirect_uri=${kakao.redirectUri}`
    // console.log("sdsdsd",kakaoAuthURL);
    res.redirect(kakaoAuthURL);
};

// kakao register --> REDIRECT URI
const kakaoRegister = async (req,res) => {

    const { code } = req.query;
    // console.log("123213213213123",code);
    const options = {
        url : "https://kauth.kakao.com/oauth/token",
        method : 'POST',
        form: {
            grant_type: "authorization_code",
            client_id: kakao.clientid,
            redirect_uri: kakao.redirectUri,
            code: code
        },
        headers: {
            "content-type" : "application/x-www-form-urlencoded"
        },
        json: true,
    };
    
   const kakaotoken = await rp(options);
   //console.log("ttttttttt",kakaotoken);
   const options1 = {
        url : "https://kapi.kakao.com/v2/user/me",
        method : 'GET',
        headers: {
            Authorization: `Bearer ${kakaotoken.access_token}`,
            'Content-type' : 'application/x-www-form-urlencoded;charset=utf-8'
        },
        json: true,
    };
    const userInfo = await rp(options1);
    // console.log("1111111111",userInfo);
   
    const userId = userInfo.id;
    const userNick = userInfo.kakao_account.profile.nickname;
    const existUser = await User.findOne({where: { userId: userId }});
    // console.log('userId-->',userId);
    // console.log('userNick-->',userNick);

   
   
        if(!existUser){
            const from = 'kakao'
            // const user = new User({ userId, userNick, from })
            await User.create({ userId, userNick, from }); //? create가 save()랑 같나? 
        }
    
        const loginUser = await User.findOne({where: { userId: userId }});
        // console.log("222222222",userId);
        // console.log("33333333",loginUser.dataValues.userId);
        const token = jwt.sign({ userId : loginUser.dataValues.userId }, `${process.env.KEY}`); // 이부분 바꿨는데 userId : loginUser.userId --> ? 


        console.log("12321321",loginUser);
        // console.log(loginUser)

        res.status(200).json({
            token,
            userId,
            userNick,
        });
};

module.exports = {kakaoLogin,kakaoRegister};
