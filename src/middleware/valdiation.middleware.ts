import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import type { ZodType } from "zod";
import { BadRequestException, MapGraphQLError } from "../common/exceptions";

type keyRequestType= "body" | "query" | "params";;
type validationSchemaType= Partial<Record<keyRequestType, ZodType>>;
type validationErrorType=Array<{
     key:keyRequestType,
            issues:Array<{
                message:string,
                path:Array<string|number|symbol>
            }>
        }>

        
export const valdiation=(schema:validationSchemaType) => {
    return  (req:Request, res:Response, next:NextFunction) => {
        const vaildationErrors: validationErrorType = []
        for(const key of Object.keys(schema) as keyRequestType[] ){
            if(!schema[key])continue;
            if(req.file){
                req.body.file=req.file
            }
              if(req.files){
                req.body.files=req.files
            }
            const valditionResult=schema[key].safeParse(req[key]);
           if(!valditionResult.success){
            const error= valditionResult.error as z.ZodError;
               vaildationErrors.push({key,issues:error.issues.map(issue=>({message:issue.message,path:issue.path}))});
           }
           else{
            req[key]=valditionResult.data;
           }
        }
        if(vaildationErrors.length>0){
            return res.status(400).json({error:vaildationErrors})
        }
        return next();
    }

}






        
export const GQLvaldiation=async <T>(schema:ZodType,args:T):Promise<boolean> => {
      const valditionResult=schema.safeParse(args);
           if(!valditionResult.success){
            throw MapGraphQLError(new BadRequestException("valdiation Error",{issues: valditionResult.error.issues.map(issue=>{return{path:issue.path,message:issue.message}})}))
           }
           return true

}




export const Socketvaldiation=async <T>(schema:ZodType,args:T):Promise<boolean> => {
      const valditionResult=schema.safeParse(args);
           if(!valditionResult.success){
            throw MapGraphQLError(new BadRequestException("valdiation Error",{issues: valditionResult.error.issues.map(issue=>{return{path:issue.path,message:issue.message}})}))
           }
           return true

}