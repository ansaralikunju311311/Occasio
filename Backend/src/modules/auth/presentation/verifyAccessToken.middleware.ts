import { NextFunction,Request,Response } from 'express'
import jwt from 'jsonwebtoken'
import { HttpStatus } from '../../../common/constants/http-stattus.js';
import { CreateToken } from '../../../common/service/token.service.js';


const tokenService = new CreateToken()
export const verifyAccessToken =(req:Request,res:Response,next:NextFunction)=>{




     console.log("checking the red",req.headers)
    console.log('reced')
    const authHeader = req.headers.authorization;
   console.log(authHeader)
    if(!authHeader){
         return res.status(HttpStatus.UNAUTHORIZED).json({
            message:"Token missing"
         })
    }
    

   
    const token = authHeader?.split(" ")[1];

       if (!token) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
            message: "Token missing"
        })
        
    }
    try {;
    
         const decode =  tokenService.verifyAccessToken(token);
         (req as any).user = decode;
         next();
    } catch (error) {
        


        return res.status(HttpStatus.UNAUTHORIZED).json({message:"Invalid Tokne"})
    }
}