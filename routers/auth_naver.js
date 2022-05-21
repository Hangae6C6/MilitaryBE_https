const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const passport = require('../passport/NaverStrategy')
const router = express.Router()

// //네이버 로그인 하기
// router.get('/naver1',passport.authenticate('naver', {authType: 'reprompt'}))

// //콜백 url
// router.get('/naver/callback1', passport.authenticate('naver',{
//     failureRedirect: "/",}),
//     (req,res)=> {
//         res.redirect('/')
//     }
// ),
// (req,res)=>{
//     try {
//         const token = createJwtToken(req.user._id);
//         console.log("여긴 ok 잘됩니당")
//         //쿠키로 토큰을 발급한 후 리다이렉트
//         //사용자 인증이 끝나면 돌아갈 URL주소
//         res.status(200).redirect("http://3.34.98.31/api/naver?token="+token)
//     }catch (error) {
//         console.log(error)
//         console.log("auth_naver.js 콜백url -> 여기서 에러발생함")
//         res.status(400).json({result:false,msg:"콜백 실패..."})
//     }

// }

module.exports = router;