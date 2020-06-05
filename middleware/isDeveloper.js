
export const onlyDeveloper = async (req, res, next) => {
        let {role} = req.user
        if (Object.keys(req.user).length) {

                
                if ((role !== 'admin') && (role !== 'developer')) return res.status(401).json({ type: 'not-authorized', message: 'Only admin and developer can access in this content' });
        }
        next()
}