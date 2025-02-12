import jwt from 'jsonwebtoken';
import config from '../config/index.js';

function tokenAuth(req,res,next){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        res.status(401).send('Unauthorized');
    }

   const tokens = authHeader.split(' ');
   const authToken = tokens[1];
   
   jwt.verify(authToken,config.jwtSecret,(err,decoded) => {
        if(err){
            res.status(401).send('Unauthorized');
        }else{
            console.log(decoded);
            next();
        } 
   });
}

export default tokenAuth;