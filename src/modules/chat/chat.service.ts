import { HydratedDocument, Types } from "mongoose"
import { IChat, IUser } from "../../common/interfaces"
import { ChatRepository, UserRepository } from "../../DB/repository"
import { ChatEnum } from "../../common/enums"
import { S3Service } from "../../services"
import { randomUUID } from "node:crypto"





export class ChatService{
    private chatRepository:ChatRepository
    private userRepository:UserRepository
    private s3Service:S3Service
    constructor(){
        this.chatRepository= new ChatRepository()
        this.userRepository= new UserRepository()
        this.s3Service=new S3Service()
    }

    sayHi=()=>{
        return"Done chat service"

    }

   async getChat(participantId:string, {page,size}: {page?:string, size?:string},user:HydratedDocument<IUser>): Promise<IChat> {
    const chat = await this.chatRepository.findOneChat({
        filter: {
      participants: {
        $all: [
          new Types.ObjectId(user._id),
          new Types.ObjectId(participantId)
        ]
      },
      options: {
        populate:[{path:"participants",select:"name email profileImage"}]
      },
      page,
        size
    }
   })
   if(!chat){
    throw new Error("Chat not found 😈")
   }
        return chat.toJSON();
    }
    





      async sendMessage(content:string, sendTo:string, userId:string): Promise<any> {
    let chat = await this.chatRepository.findOneAndUpdate({
        filter: {
        participants: {$all: [new Types.ObjectId(userId), new Types.ObjectId(sendTo)]},
        type:ChatEnum.ovo
        },
        update:{
            messages:{
                $addToSet:{
                    content,
                    createdBy:new Types.ObjectId(userId)
                }
                }
            }
        })
        if(!chat){
            chat  = await this.chatRepository.createone({
                data:{
                    
                    participants:[new Types.ObjectId(userId), new Types.ObjectId(sendTo)],
                    createdBy:new Types.ObjectId(userId),
                    type:ChatEnum.ovo,
                    messages:[{
                        content,
                        createdBy:new Types.ObjectId(userId)
                    }]
                }
            })
           }

}

async createGroupChat ({participantsTds=[],group}: {participantsTds: string[] |Types.ObjectId[], group: string},user:HydratedDocument<IUser>,file?:Express.Multer.File,):Promise<IChat>{
     participantsTds=[...new Set(participantsTds.map(ele=>new Types.ObjectId(ele as string)))]
     const users = await this.userRepository.find({
        filter:{
            _id:{
                $in:participantsTds,
                
            },
            friends:{
                $in:[user._id]
            }

        }

     })
    if (users.length !== participantsTds.length) {
    throw new Error("Invalid participants 😈");
}

let groupImage!: string;

const roomId = randomUUID();
const path = `Chat/groupImage/${roomId}`;

if (file) {
    groupImage = (await this.s3Service.uploadAsset({
        path,
        file: file.buffer,
       
    })).url;
}

const groupChat = await this.chatRepository.createone({
    data: {
        participants: [...participantsTds, new Types.ObjectId(user._id)],
        createdBy: new Types.ObjectId(user._id),
        type: ChatEnum.ovo,
        group,
        roomId,
        groupImage
    }
}
)


return groupChat.toJSON();
}


async getGroupChat(
  groupId: string,
  { page, size }: { page?: string; size?: string },
  user: HydratedDocument<IUser>
): Promise<IChat> {

  const chat = await this.chatRepository.findOneChat({
    filter: {
      _id: new Types.ObjectId(groupId),
      participants: {
        $in: [user._id] },
      type: ChatEnum.ovo
    },
    options: {
      populate: [
        { path: "participants", select: "name email profileImage" },{path:"createdBy"}
      ]
    },
    page,
    size
  });

  if (!chat) {
    throw new Error("Chat not found 😈");
  }

  return chat.toObject(); 
}

    






async sendGroupMessage(content:string, groupId:string, userId:string): Promise<string> {
    let chat = await this.chatRepository.findOneAndUpdate({
        filter: {
        _id: new Types.ObjectId(groupId),
        participants: {$in: [new Types.ObjectId(userId)]},
        type:ChatEnum.ovo
        },
        update:{
            messages:{
                $addToSet:{
                    content,
                    createdBy:new Types.ObjectId(userId)
                }
                }
            }
        })
        if(!chat){
            throw new Error("Chat not found 😈")
           }
           return chat.roomId

}


}

export const chatService = new ChatService()