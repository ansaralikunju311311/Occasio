import { Request,Response,NextFunction } from "express";

import { HttpStatus } from "../common/constants/http-stattus.js";
import { AppError } from "../common/errors/app-error.js";

export const errorMiddleware=(err:any,req:Request,res:Response,next:NextFunction)=>{
    console.log("error",err)
    if(err instanceof AppError){

        return res.status(err.statusCode).json({
            message:err.message
        })
    }


    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message:"Something Wrong"
    })
}