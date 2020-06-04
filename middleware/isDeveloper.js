import { UserModel } from '../model';

export const onlyDeveloper = async (req, res, next) => {
        const user = await UserModel.findOne({username:req.user.username}) 
        let { role } = user
        if (user) {
                
                if ((role !== 'admin') && (role !== 'developer')) return res.status(401).json({ type: 'not-authorized', message: 'Only admin and developer can access in this content' });
        }
        next()
}