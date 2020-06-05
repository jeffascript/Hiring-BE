export const onlyCompany = async (req, res, next) => {

        if (Object.keys(req.user).length) {
                if ((req.user.role !== 'admin') && (req.user.role !== 'company')) return res.status(401).json({ type: 'not-authorized', message: 'Only admin and company can access in this content' });

        }

        next()
}