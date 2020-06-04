// import {UserModel} from '../model';

// export const onlyAdmin = async (req, res, next) => {
//         const user = await UserModel.findOne({username:req.user.username}) 
//         if (user && (user.role !== 'admin')) return res.status(401).json({ type: 'not-authorized', message: 'Only admin can access in this content' });
//         next() 
// }
 

export const onlyAdmin = async (req, res, next) => {
       
        if (Object.keys(req.user).length && (req.user.role !== 'admin')) return res.status(401).json({ type: 'not-authorized', message: 'Only admin can access in this content' });
        next()
}



