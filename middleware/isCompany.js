import {UserModel} from '../model';

export const onlyCompany = async (req, res, next) => {
        const user = await UserModel.findOne({email:req.body.email}) 
        if ((user.role !== 'admin') ||(user.role !== 'company')) return res.status(401).json({ type: 'not-authorized', message: 'Only admin and company can access in this content' });
        next()
}