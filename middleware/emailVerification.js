import {UserModel} from '../model';

export const  verifyEmail = async (req, res, next) => {
        const user = await UserModel.findOne({username:req.body.username}) 
        if (user && !user.isVerified) {
               
              return res.status(401).json({ type: 'not-verified', message: 'Your account has not been verified.' }); 
        }
        next()
}
