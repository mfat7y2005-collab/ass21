import { Types } from "mongoose";
import { IUser } from "./user.interface";
import { AvailabilityEnum } from "../enums";

export interface IPost{
    folderId:string;
    content?:string;
    attachments?:string[];
    availability:AvailabilityEnum;
    isDeleted:Boolean;


    likes?:Types.ObjectId[]|IUser,
    tags?:Types.ObjectId[]|IUser,
    crearedBy:Types.ObjectId|IUser,
    updateddBy:Types.ObjectId|IUser,

    createdAt:Date
    deletedAt?:Date
    restoredAt?:Date
    updatedAt?:Date





}