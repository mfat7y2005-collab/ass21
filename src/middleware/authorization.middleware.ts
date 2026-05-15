
import { Request, Response, NextFunction } from "express";
import { RoleEnum } from "../common/enums";
import { HydratedDocument } from "mongoose";
import { IUser } from "../common/interfaces";
import { GraphQLError } from "graphql";

export const authorization = (roles: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user;

      if (!user) {
        return next(new Error("Unauthorized"));
      }

      if (roles.length && !roles.includes(user.role)) {
        return next(new Error("Forbidden: Access denied"));
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}



export const GQLAuthorization =(roles:RoleEnum[],user:HydratedDocument<IUser>)=>{
  if(!roles.includes(user.role)){
    throw new GraphQLError ("Not authorized account",{extensions:{statusCode:403}})
  }
  return true
}