import jwt from 'jsonwebtoken';


export const generateToken = ({_id,email,surname,username}) => jwt.sign({_id,email,surname,username},process.env.JWT_SECRET,{expiresIn:'24h'})