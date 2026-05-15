import { HydratedDocument } from "mongoose";
import { IUser } from "../common/interfaces";
import { JwtPayload } from "jsonwebtoken";




declare module "express-serve-static-core"{
    interface Request{
        user:HydratedDocument<IUser>,
        decoded:JwtPayload
    }
}