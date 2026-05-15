import { HydratedDocument, Types } from "mongoose";
import { CreateCommentBodyDto, CreateCommentParamsDto, CreateReplyCommentParamsDto } from "./comment.dto";
import {IComment,  IPost,  IUser } from "../../common/interfaces";

import { PostRepository } from "../../DB/repository/post.repository";
import { NotificationService, s3Service, S3Service } from "../../services";
import { redisService } from "../../services";
import { UserRepository } from "../../DB/repository/user.repository";


import { CommentRepository } from "../../DB/repository";
import { getAvailability } from "../../common/utlis/post";


export class CommentService {

    private readonly redis = redisService
    private readonly userRepository: UserRepository
    private readonly commentRepository: CommentRepository


    private readonly postRepository: PostRepository
    private readonly notification: NotificationService
    private readonly s3:S3Service

    constructor() {
        this.userRepository = new UserRepository();
        this.commentRepository = new CommentRepository();

        this.postRepository = new PostRepository();
        this.notification = new NotificationService();
        this.s3= s3Service
    }


    async createComment({postId}:CreateCommentParamsDto
       , {  content, files, tags }: CreateCommentBodyDto,
        user: HydratedDocument<IUser>
    ):Promise<IComment> {

    
        const post = await this.postRepository.findOne({
            filter:{
                _id:postId,
                $or:getAvailability(user)
            }
        })
        if(!post){
            throw new Error("Fail to find matching post")
        }


        const mentions:Types.ObjectId[] =[]
        const FCM_Tokens:string[]=[]


        if (tags?.length) {
            const mentionedAccounts = await this.userRepository.find({
                filter: {
                    _id: { $in: tags },
                },
            });

            if (mentionedAccounts.length !== tags.length) {
                throw new Error("Failed to find some or all mentioned users");
            }

            for(const tag of tags){
                mentions.push(Types.ObjectId.createFromHexString(tag));
                (await this.redis.getFCMs(tag) || []).map(token=>FCM_Tokens.push(token))
            }

        }


        const folderId = post.folderId


       if (files?.length) {
    const firstFile = files[0]!;

    await this.s3.uploadAssets({
        Bucket: process.env.AWS_BUCKET_NAME!,
        files: files.map(file => file.buffer!),
        ContentType: firstFile.mimetype,
        path: `Post/${folderId}`,
    });
}
        

       const comment = await this.commentRepository.createone({
    data: {
        crearedBy: user._id,
        content: content as string,
        attachments: files,
        postId:post._id,
        tags: mentions,
    },
});

if (!comment) {
    throw new Error("Fail");
}

if (FCM_Tokens.length) {
    await this.notification.sendNotifications({
        tokens: FCM_Tokens,
        data: {
            title: "Post mention",
            body: JSON.stringify({
                message: `${user.username} mentioned you in this comment`,
                postId: post._id,
                commenId:comment._id
            }),
        },
    });
}

      return comment.toJSON()
       }
       



        async replyOnComment({postId,commentId}:CreateReplyCommentParamsDto
       , {  content, files, tags }: CreateCommentBodyDto,
        user: HydratedDocument<IUser>
    ):Promise<IComment> {

    
        const comment = await this.commentRepository.findOne({
            filter:{
                _id:commentId,
                postId:postId,
                
            },
            options:{
                populate:[{
                    path:"postId",
                    match:{
                $or:getAvailability(user)

                }}]
            }
        })
        if (!comment) {
        throw new Error("Comment not found");
    }

    if (!comment?.postId) {
        throw new Error("Post not accessible");
    }










        const mentions:Types.ObjectId[] =[]
        const FCM_Tokens:string[]=[]


        if (tags?.length) {
            const mentionedAccounts = await this.userRepository.find({
                filter: {
                    _id: { $in: tags },
                },
            });

            if (mentionedAccounts.length !== tags.length) {
                throw new Error("Failed to find some or all mentioned users");
            }

            for(const tag of tags){
                mentions.push(Types.ObjectId.createFromHexString(tag));
                (await this.redis.getFCMs(tag) || []).map(token=>FCM_Tokens.push(token))
            }

        }

        const post=comment.postId as HydratedDocument<IPost>
        const folderId = post.folderId


       if (files?.length) {
    const firstFile = files[0]!;

    await this.s3.uploadAssets({
        Bucket: process.env.AWS_BUCKET_NAME!,
        files: files.map(file => file.buffer!),
        ContentType: firstFile.mimetype,
        path: `Post/${folderId}`,
    });
}
        

       const reply = await this.commentRepository.createone({
    data: {
        crearedBy: user._id,
        content: content as string,
        attachments: files,
        postId:postId,
        commentId:comment._id,
        tags: mentions,
    },
});

if (!reply) {
    throw new Error("Fail");
}

if (FCM_Tokens.length) {
    await this.notification.sendNotifications({
        tokens: FCM_Tokens,
        data: {
            title: "Post mention",
            body: JSON.stringify({
                message: `${user.username} mentioned you in this comment`,
                postId: post._id,
                commenId:comment._id,
                replyId:reply._id
            }),
        },
    });
}

      return reply.toJSON()
       }
    }


export const commentService = new CommentService();