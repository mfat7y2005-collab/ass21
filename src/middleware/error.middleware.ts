import { Request, Response, NextFunction } from "express";

interface IError extends Error {
    cause?: {
        statusCode: number;
    
    }
}
export const globalErrorHandler = (err:IError,req:Request,res:Response,next:NextFunction)=>{
    if(err.name=="MulterError"){
        (err as any).statusCode =400;
    }
    console.error(err);

    
    res.status((err.cause?.statusCode) || 500).json({
        message:err.message || "Internal Server Error",
        
        // extra:err.cause?.extra,
         cause:err.cause,
        error:err.message,
          stack:err.stack
    
    });
}