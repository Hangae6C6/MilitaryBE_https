const express = require('express');
const rp = require('request-promise');
const {User,UserData} = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const kakao = {
    clientid: `${process.env.CLIENTED}`, //REST API
    redirectUri : 'https://soldierchallengers.com/api/auth/kakao/callback' 
};

// kakao login page URL --> HTML BUTTON CLICK --> ROUTER.KAKAOLOGIN
const kakaoLogin = async (req,res) => {
    console.log("1111111",kakaoLogin);
    const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakao.clientid}&redirect_uri=${kakao.redirectUri}`
    res.redirect(kakaoAuthURL);
};

// kakao register --> REDIRECT URI
const kakaoRegister = async (req,res) => {

    const { code } = req.query;
    console.log("123123123123",code);
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
   console.log("33333333",kakaotoken);
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
    console.log("12334455555",userInfo);
   
    const userId = userInfo.id;
    const userNick = userInfo.kakao_account.profile.nickname;
    const existUser = await User.findOne({where: { userId: userId }});
    
        if(!existUser){
            const from = 'kakao'
            // const user = new User({ userId, userNick, from })
            await User.create({ userId, userNick, from }); 
        };

        let userData = await UserData.findOne({
            where: { userId : userId },
        });
        let userDataCheck = true;
        if(!userData){
            userDataCheck=false;
        };
            
        const loginUser = await User.findOne({where: { userId: userId }});
        const token = jwt.sign({ userId : loginUser.dataValues.userId }, `${process.env.KEY}`); // ????????? ???????????? userId : loginUser.userId --> ? 

        res.status(200).json({
            token,
            userId,
            userNick,
            userDataCheck
        });
        console.log(token,userId,userNick);
};

module.exports = {kakaoLogin,kakaoRegister};
