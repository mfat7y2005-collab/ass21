import { Types } from "mongoose";
import { IUser } from "./user.interface";
import { IPost } from "./post.interface";



export interface IComment{
 
    content?:string;
    attachments?:string[];
   



    postId:Types.ObjectId | IPost,
    commentId:Types.ObjectId | IComment,


    likes?:Types.ObjectId[]|IUser,
    tags?:Types.ObjectId[]|IUser,
    crearedBy:Types.ObjectId|IUser,
    updateddBy:Types.ObjectId|IUser,

    createdAt:Date
    deletedAt?:Date
    restoredAt?:Date
    updatedAt?:Date





}