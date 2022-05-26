const { Challenge, User, UserData, ChallengeJoin } = require("../models");
const sequelize = require("sequelize");
const { or, and, like } = sequelize.Op;

//마이페이지 조회 GET
//썬더클라이언트 테스트 완료 - 현재 유지 통과
const myPage = async (req, res) => {
    try {
        const {userId} = req.query
        const userchallenge = await ChallengeJoin.findAll({
            where:{
                userId:userId,
            }
        })
        return res.status(200).json(userchallenge);
        
    }catch(error) {
        console.log(error)
        console.log('myPage 마이페이지 조회 기능 -> 여기서 오류발생함')
        res.status(400).json({result:false,msg:"마이페이지 조회 실패"})
    }
};

//프로필 조회 GET
//썬더클라이언트 테스트 완료
//예외처리를 해야함 - 현재 유지 통과
const userProfileread = async (req, res) => {
    try {
        const {userId} = req.query //보내는곳은 같고, auth(통일)
        // console.log(userId) 
        const userdata = await UserData.findOne({
            include:{
                model:User,attributes:['userNick']
            },
            where:{
                userId:userId
            },
        })
        // const userNick = await User.findOne({
        //     attributes:['userNick'],
        //     where:{userId},
        // })
        res.status(200).json({result:true,msg:"프로필 조회 성공",userdata});
    }catch(error) {
        console.log(error)
        console.log('mypage 프로필 조회하기 -> 여기서 오류발생함')
        res.status(400).json({result:false,msg:"프로필 조회 실패..."})
    }
};

//프로필 수정하기 PUT
//썬더클라이언트 테스트 완료
const userProfileput = async (req, res) => {
    const {userId} = req.query
    const {armyCategory,rank,startDate,endDate} = req.body
    const {userNick} = req.body
    // const {rank} = req.body
    try {
        const armymodify = await UserData.update({armyCategory:armyCategory,startDate:startDate,endDate:endDate,rank:rank},{
            where: {
                userId:userId,
            }
        })
        const usermodify = await User.update({userNick},{
            where:{
                userId:userId,
            }
        })
        // const rankmodify = await UserData.update({rank:rank},{
        //     where: {
        //         userId:userId,
        //     }
        // })
        return res.status(201).json({result:true,msg:"프로필 수정 완료",armymodify,usermodify});

    }catch(error) {
        console.log(error)
        console.log('mypage.js 프로필 수정하기 -> 여기서 오류발생함')
        res.status(400).json({result:false,msg:"프로필 수정 실패..."})
    }
};

//마이페이지 - 나의챌린지 수정 query(userNum) PUT
//썬더클라이언트 테스트 완료
const myPageChallengeread = async (req,res) =>{
    const {challengeNum} = req.query
    const {challengeTitle} = req.body
    try {
        const userchallenge = await Challenge.update({challengeTitle:challengeTitle},{
            where: {
                challengeNum:challengeNum,
            }
        })
        return res.status(200).json({userchallenge});
    }catch(error) {
        console.log(error)
        console.log('mypage.js 나의 챌린지 조회 -> 여기서 에러발생함')
        res.status(400).json({result:false,msg:"나의 챌린지 조회 실패..."})
    }
}

//마이페이지 - 사전테스트 결과
//썬더클라이언트 테스트 완료
const myPageChallengetest = async(req,res)=> {
    try {
        const {userId} = req.query
        if (userId) {
            const test = await UserData.findAll({attributes:['userId','testResult'],where:{userId:userId}})
            res.status(200).json({result:true,msg:"성공!",test})
        }else {
            res.status(400).json({result:false,msg:"로그인 후 이용해주세요"})    
        }
    }catch (error) {
        console.log(error, "mypage.js 테스트조회하기 기능에서 오류남")
        res.status(400).json({result:false,msg:"실패!!"})
    }

}


module.exports = { myPage,
    userProfileread,
    userProfileput,
    myPageChallengeread,
    myPageChallengetest,
    // preTestread,
    // preTestpatch
 };