const passport = require('passport')
const jwt = require('jsonwebtoken')
const NaverStrategy = require('passport-naver').Strategy
const {Op} = require('sequelize')
const env = require('./env')
const {User} = require('./models')

module.exports = (app)=> {
    app.use(passport.initialize()) // passport 구동 함수

    passport.use(new NaverStrategy({
        clientID: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        callbackURL: `${env.DOMAIN}/api/auth/naver/callback`,
    },  async (accessToken, refreshToken, done)=> {
        try {
            const providerId = profile?.id;
            const userEmail = profile?.email;
            const nickName = profile?.displayName;
            const provider = 'naver';
            const exp = 0;
            const role = 'base_user';
            if (!providerId) {
                next(null, false, {msg:"providerId 검증 오류"})
            }

            if (await User.findOne({
                where: {
                    providerId,
                    deletedAt:{
                        [Op.not]: null,
                    },
                },
            })){
                next(null,false,{msg:"회원 탈퇴 후 14일 이전에는 동일 ID 사용이 불가능합니다."})
            }
            let user = await User.findOne({where : {providerId}})
            if (!user) {
                user = await User.create({
                    providerId, userEmail, nickName, provider, exp, role,
                })
                .then(async (resule)=>{
                    const userId = result.id;
                    const {presetRoutine1} = presetConst
                    const {presetRoutine2} = presetConst

                    await createRoutineFn(userId, presetRoutine1.routineName,0,1,presetRoutine1.actions)
                    await createRoutineFn(userId, presetRoutine2.routineName,0,1,presetRoutine2.actions)
                })
                console.log('이용중인 유저가 없어 회원가입됩니다.', user)
            }else {
                console.log('이용중인 유저가 이미 존재하여 회원가입이 불가능합니다.', user)
            }

            //refresh token 발급(10일)
            const refreshToken = jwt.sign({providerId}, env.JWT_SECRET_KEY,{
                expiresIn: '10d',
                issuer: 'soldierChallenge',
            })

            await User.update(
                {refreshToken},
                {where:{providerId: providerId.toString() } },
            );

            done(null,profile, {
                refreshToken,
                accessToken,
            })
        }catch (error) {
            console.log(error)
            console.log('naver 소셜 로그인 -> 여기서 에러발생함')
            return done(error)
        }
    }))
}