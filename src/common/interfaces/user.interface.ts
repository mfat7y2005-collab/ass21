import { AvailabilityEnum, GenderEnum, RoleEnum } from "../enums";
import { Types } from "mongoose";
import { IPost } from "./post.interface";

export interface IUser {
    firstName:string;
    lastName:string;
    username?:string;
    friends?:Types.ObjectId[]|IUser[]
    content?:string;
      availability: AvailabilityEnum;
    attachments?:string;
    folderId:string;
    slug:string;
    email:string;
    password:string;
    bio?:string;
    phone?:string;
    profileImage:string;
    coverImage:string[];
    DOB?:Date;
    confirmedAt?:Date;
    gender:GenderEnum;
    role:RoleEnum;
    createdAt:Date;
    updatedAt?:Date;
    confirmEmail:Date;
    resendConfirmEmail:Date;
    provider:number;
    
     deletedAt?:Date;
     restoredAt?:Date;

    postId:Types.ObjectId | IPost,
}