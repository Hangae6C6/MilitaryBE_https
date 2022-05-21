const { UserData } = require("../models");
const sequelize = require("sequelize");
const moment = require('moment')
const { or, and, like } = sequelize.Op;

//전역일 계산기-남은일수 가져오기
const endDay = async (req,res)=> {
    if (!res.locals.user) {
        res.status(401).json({
          result:false,msg:"로그인 후 사용하세요",
        })
        return
    }
    const {userId,endDate} = req.query
    const today = moment()
    try {
        const endDates = await UserData.findAll({
            where:{
                endDate:endDate,
            }
        })
        const now = today.format('YYYY-MM-DD')
        const a = today.diff(endDate, 'days')
        console.log(today,now,endDate)
        // console.log(now.diff(endDates, 'days'))
        console.log(`전역까지 ${-a+1}일 남았습니다.`)
        res.status(200).json({result:true,msg:`${-a+1}`})
    }catch (error) {
        console.log(error)
        console.log('cal.js전역일 계산 -> 여기서 오류발생함 ')
        res.status(400).json({result:false,msg:"전역일 계산 실패"})
    } 
}

module.exports = { endDay };