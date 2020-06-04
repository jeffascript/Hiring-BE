import {Router} from 'express';
import {UserModel} from '../model';
import passport from 'passport';
import {verifyEmail} from '../middleware'
import {generateToken, sendEmail, signUpTemplate} from '../utils'


const router = Router()

router.post("/register", async (req, res) => {
    try {
        const checkUsername = await UserModel.findOne({username:req.body.username}) 
        if (checkUsername && checkUsername.username) 
            return res.status(500).json({ type: 'USERNAME_EXIST', message: 'username is already taken' });

            const checkEmail = await UserModel.findOne({email:req.body.email}) 
            if (checkEmail && checkEmail.email) 
                return res.status(500).json({ type: 'EMAIL_EXIST', message: 'email is already taken' });

        const user = await UserModel.register(req.body, req.body.password)
        const token = generateToken(user)
        let subject = "DEV-HUNTER Account Verification Token"
        let to = user.email
        let from = process.env.FROM_EMAIL
        let link = `${process.env.FRONT_BASE_URL}/verify?token=${token}`
        let html = signUpTemplate(user.surname,link )

        await sendEmail({
            to,
            from,
            subject,
            html
        });
        res.status(200).json({
            message: 'You have been successfully registered check your email to activate your account'
        })

    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.post("/login", verifyEmail, passport.authenticate('local'), async (req, res) => {
    try {
        const token = generateToken(req.user)
        let {_id,username, email,firstname, surname, role, location,github, linkedIn} = req.user
        let curentUser = {
            _id,
            username,
            email,
            firstname,
            surname,
            role,
            location,
            github,
            linkedIn
        }
        res.send({
            access_token: token,
            userInfo: curentUser 
        })
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
})

router.post("/refreshtoken", passport.authenticate('jwt'), async (req, res) => {
    try {
        const token = generateToken(req.user)
        res.send({
            access_token: token,
            username: req.user.username,
            userInfo:req.user
        })
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.get('/verify',passport.authenticate('jwt'), async (req, res) => {
    try {
        const userProfile = await UserModel.findOneAndUpdate({
            username: req.user.username
        }, {
            $set: {
                isVerified: true
            }
        }, {
            new: true
        });
        
        res.status(200).send({success:true,message:'email verified'})
    } catch (error) {
        res.status(500).send(error.message)
    }
});

router.get('/linkedin',
  passport.authenticate('linkedin'));

router.get('/linkedin/callback', 
  passport.authenticate('linkedin', { failureRedirect: `${process.env.FRONT_BASE_URL}/login` }),
   async (req, res) => {
    // Successful authentication, redirect login.
    const token = generateToken(req.user)
    res.redirect(`${process.env.FRONT_BASE_URL}/register?token=${token}`);
  });

export default router
