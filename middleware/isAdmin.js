import {UserModel} from '../model';

export const onlyAdmin = async (req, res, next) => {
        const user = await UserModel.findOne({email:req.body.email}) 
        if (user.role !== 'admin') return res.status(401).json({ type: 'not-authorized', message: 'Only admin can access in this content' });
        next()
}