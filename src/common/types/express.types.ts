import { HydratedDocument } from "mongoose";
import { IUser } from "../interfaces";
import { JwtPayload } from "jsonwebtoken";
import { Socket } from "socket.io";




export interface IAuthUser{
    user:HydratedDocument<IUser>,
    decoded:JwtPayload
}

export interface IAuthSocket extends Socket{
    data:IAuthUser
}