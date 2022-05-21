const express = require('express');
const rp = require('request-promise');
const {User} = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const naver = {
    clientid: `${process.env.NAVER_CLIENT_ID}`, //REST API
    redirectUri	: 'http://localhost:3000/api/auth/naver/callback'
}

// kakao login page URL --> HTML BUTTON CLICK --> ROUTER.KAKAOLOGIN
const  naverLogin = async (req,res) => {
    const naverAuthURL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_CALLBACK_URL}`
    console.log("sdsdsd",naverAuthURL);
    res.redirect(naverAuthURL);
};

// naver register --> REDIRECT URI
const naverRegister = async (req,res) => {

    const { code,state } = req.query;
    console.log("123213213213123",code,state);
    const options = {
        url : "https://nid.naver.com/oauth2.0/token",
        method : 'POST',
        form: {
            grant_type: "authorization_code",
            client_id: naver.clientid,
            redirect_uri: naver.redirectUri,
            code: code,
            state:state
        },
        headers: {
            "content-type" : "application/x-www-form-urlencoded"
        },
        json: true
    }
    
   const navertoken = await rp(options);
   console.log("ttttttttt",navertoken);
   const options1 = {
        url : "https://openapi.naver.com/v1/nid/me",
        method : 'GET',
        headers: {
            Authorization: `Bearer ${navertoken.access_token}`,
            'Content-type' : 'application/x-www-form-urlencoded;charset=utf-8'
        },
        json: true
    }
    const userInfo = await rp(options1);
    // console.log("1111111111",userInfo);
   
    const userId = userInfo.id;
    const userNick = userInfo.naver_account.profile.nickname;
    const existUser = await User.findOne({userId});

     try{
        if(!existUser.dataValues){
            const from = 'naver'
            const user = new User({ userId, userNick, from })
            await User.create({ userId, userNick, from });
        }
    
        const loginUser = await User.findOne({userId});
        const token = jwt.sign({ userId : loginUser.userId }, `${process.env.KEY}`);
    
        res.status(200).json({
            token,
            userId,
            userNick
        });
     } catch(error) {
        console.log("네이버로그인오류"); 
        console.log(error); 
        res.status(400).json({ result: "이미 등록된 유저입니다."}); 
        return;
     }
};

module.exports = {naverLogin,naverRegister};
