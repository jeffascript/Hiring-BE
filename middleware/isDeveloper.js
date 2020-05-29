import {UserModel} from '../model';

export const onlyDeveloper = async (req, res, next) => {
        const user = await UserModel.findOne({email:req.body.email}) 
        if ((user?.role !== 'admin') ||(user?.role !== 'developer')) return res.status(401).json({ type: 'not-authorized', message: 'Only admin and developer can access in this content' });
        next()
}