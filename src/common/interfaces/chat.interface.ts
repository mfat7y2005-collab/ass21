import { Types } from "mongoose";
import { IUser } from "./user.interface";
import { AvailabilityEnum, ChatEnum } from "../enums";

export interface IMessage{
    content?:string;
    attachments?:string[];
    likes?:Types.ObjectId[]|IUser;
    tags?:Types.ObjectId[]|IUser;
      createdAt:Date
    deletedAt?:Date
    restoredAt?:Date
    updatedAt?:Date
     createdBy:Types.ObjectId|IUser;


}


export interface IChat{
    participants:Types.ObjectId[]|IUser,
    createdBy:Types.ObjectId|IUser,
    

    messages:IMessage[],
    type?:ChatEnum,


    //ovm
    group:string,
    groupImage:string,
    roomId:string,


    



  
    createdAt:Date
    deletedAt?:Date
    restoredAt?:Date
    updatedAt?:Date





}