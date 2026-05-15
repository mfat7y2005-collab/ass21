import { HydratedDocument, Types } from "mongoose";
import { CreatePostBodyDto, ReactPosParamsDto, ReactPosQueryDto, UpdatePosBodyDto, UpdatePosParamsDto } from "./post.dto";
import { IPaginate, IPost, IUser } from "../../common/interfaces";

import { PostRepository } from "../../DB/repository/post.repository";
import { NotificationService, s3Service, S3Service } from "../../services";
import { redisService } from "../../services";
import { UserRepository } from "../../DB/repository/user.repository";
import{randomUUID} from "node:crypto"

import { getAvailability } from "../../common/utlis/post";
import { PaginateDto } from "../../common/validation";
import { toObjectId } from "../../common/utlis/objectId";
import { RealtimeGateway ,realtimeGateway} from "../realtime";



export class PostService {

    private readonly redis = redisService
    private readonly userRepository: UserRepository
    private readonly postRepository: PostRepository
    private readonly notification: NotificationService
    private readonly s3:S3Service
    private readonly realTime :RealtimeGateway

    constructor() {
        this.userRepository = new UserRepository();
        this.postRepository = new PostRepository();
        this.notification = new NotificationService();
        this.realTime =  realtimeGateway
        this.s3= s3Service
    }


    async postList({page,search,size}:PaginateDto,user:HydratedDocument<IUser>):Promise<IPaginate<IPost>>{
        const posts= await this.postRepository.paginate({
            filter:{

                $or:getAvailability(user),
                ...(search?.length?{content:{$regex:search,$options:"i"}}:{})
    
            },
            page,
            size,
            options:{
                populate:[{path:"comments", populate:[{path:"replay", }]}]
            }
        })
        return posts
    }

    async createPost(
        { availability, content, files, tags }: CreatePostBodyDto,
        user: HydratedDocument<IUser>
    ):Promise<IPost> {
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


        const folderId = randomUUID()


       if (files?.length) {
    const firstFile = files[0]!;

    await this.s3.uploadAssets({
        Bucket: process.env.AWS_BUCKET_NAME!,
        files: files.map(file => file.buffer!),
        ContentType: firstFile.mimetype,
        path: `Post/${folderId}`,
    });
}
        

       const post = await this.postRepository.createone({
    data: {
        crearedBy: user._id,
        content: content as string,
        attachments: files,
        folderId,
        availability,
        tags: mentions,
    },
});

if (!post) {
    throw new Error("Fail");
}

if (FCM_Tokens.length) {
    await this.notification.sendNotifications({
        tokens: FCM_Tokens,
        data: {
            title: "Post mention",
            body: JSON.stringify({
                message: `${user.username} mentioned you in this post`,
                postId: post._id,
            }),
        },
    });
}

      return post.toJSON()
       }






   async reactPost(
    { postId }: ReactPosParamsDto,
    { react }: ReactPosQueryDto,
    user: HydratedDocument<IUser>
): Promise<IPost> {

    const post = await this.postRepository.findOneAndUpdate({
        filter: {
            _id: postId,
            $or: getAvailability(user),
        },

        update: {
            $pull: {
                likes: {
                    createdBy: user._id
                }
            }
        }
    });

    if (!post) {
        throw new Error("fail to find matching post");
    }

    const updatedPost = await this.postRepository.findOneAndUpdate({
        filter: {
            _id: postId,
        },

        update: {
            $addToSet: {
                likes: {
                    react,
                    createdBy: user._id
                }
            }
        }
    });

    if (!updatedPost) {
        throw new Error("fail to react");
    }
     const owner= post.crearedBy as  HydratedDocument<IUser>
    const soketIds = await this.redis.getSockets(owner._id);
    if (soketIds.length) {
        this.realTime.getIo().to(soketIds).emit("like_post", {postId,userId:user._id})
    }

    return updatedPost.toJSON();
}














  async updatePost({postId}:UpdatePosParamsDto
        ,{ availability, content, files=[], tags= [],removeFile=[],removeTags=[] }: UpdatePosBodyDto,
        user: HydratedDocument<IUser>
    ):Promise<IPost> {
      
      const post = await this.postRepository.findOne({
        filter:{
            _id:postId,
            crearedBy:user._id
        }
        
      })
      if(!post){
        throw new Error("Fail to find matching post")
      }



      if(!post.content && !content && !files?.length&&post.attachments?.length == removeFile.length){
          throw new Error("We can not leave empty post")
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
                mentions.push(toObjectId(tag));
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
        

       const updatePost = await this.postRepository.findOneAndUpdate({
         filter:{
            _id:postId,
            crearedBy:user._id
         },
         update:[
            {
              $set:  {
            content:content||post.content,
            availability:Number(availability||post.availability),
            updateddBy:user._id,
            files:{
                $setUnion:[
                    {
                        $sertDifference:[
                            
                                "$files",
                                removeFile
                            
                        ]
                    },
                   files
                ]
            },
            tags:{
                 files:{
                $setUnion:[
                    {
                        $sertDifference:[
                            
                                "$tags",
                                removeFile.map(ele=> {return toObjectId(ele)})
                            
                        ]
                    },
                   mentions
                ]
            }
            }


         }
            }
         ]
});

if (!updatePost) {
    
    throw new Error("Post not found");

    // if(files.length){
    //     await Promise.all(
    //     files.map((ele)=>{
    //          return this.s3.deleteAsset({
    //             Key:ele.path as string
           
    //     });

    //     })
    // )

    // }

}



if(removeFile.length){
 await Promise.all(
    removeFile.map((ele) => {
        return this.s3.deleteAsset({
            Key: ele
        });
    })
);
}

if (FCM_Tokens.length) {
    await this.notification.sendNotifications({
        tokens: FCM_Tokens,
        data: {
            title: "Post mention",
            body: JSON.stringify({
                message: `${user.username||"User"} mentioned you in this post`,
                postId: post._id,
            }),
        },
    });
}

      return updatePost.toJSON()
       }
       
    }


export const postService = new PostService();