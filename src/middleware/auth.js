import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config();

export const auth = async(req, res, next) => {
     const token = req.header('Authorization')?.replace('Bearer ', '')

    if(!token) return res.status(401).json('Acesso Negado');

    try{
        const secret = process.env.PRIVATE_KEY;
        const decoded = jwt.verify(token, secret)
        req.user = decoded;
        next()
    }catch(e){
        console.log(e)
        res.json({message: "Erro no servidor"});
    };
};


