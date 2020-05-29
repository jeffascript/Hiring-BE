import {UserModel} from '../model';

export const  verifyEmail = async (req, res, next) => {
        const user = await UserModel.findOne({email:req.body.email}) 
        if (!user.isVerified) {
               
                 res.status(401).json({ type: 'not-verified', message: 'Your account has not been verified.' }); 
                 next()
                 return
        }
        next()
}
