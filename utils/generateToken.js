import jwt from 'jsonwebtoken';


export const generateToken = ({_id,email,surname}) => jwt.sign({_id,email,surname},process.env.JWT_SECRET,{expiresIn:'24h'})