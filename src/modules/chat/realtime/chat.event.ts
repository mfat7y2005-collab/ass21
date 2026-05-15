import { Server } from "socket.io";
import { IAuthSocket } from "../../../common/types/express.types"
import { Socketvaldiation } from "../../../middleware"
import { RadisService } from "../../../services"
import { ChatService,chatService } from "../chat.service"
import *  as validators from '../chat.validation'

export class ChatEvent{
    private chatService:ChatService
    private radisService:RadisService
    constructor(){
        this.chatService = chatService
        this.radisService = new RadisService()
    }

    sayHi =  (socket:IAuthSocket)=>{
        return  socket.on("sayHi",async (data:{name:string})=>{
                try{
                    await Socketvaldiation<{name:string}>(validators.sayHi,data)
                    console.log({data})
                    const result= this.chatService.sayHi()

                // callback("BE  TO   FE   ✌️" )
                // connection.push(socket.id)
        
                socket.emit("sayHi","FE  TO   BE   ✌️",result)
                // this.io.emit("sayHi","BE  TO   FE   ✌️")
                // socket.broadcast.emit("sayHi","BE  TO   FE   ✌️")
                // socket.to(connection.at(-2) as string).emit("sayHi","BE  TO   FE   ✌️"
                // )
                // socket.except(connection.slice(0,-1)).emit("sayHi","BE  TO   FE   ✌️")
                // this.    io.except(socket.id).emit("sayHi","BE  TO   FE   ✌️")
                  throw new Error("Error in sayHi event")
                }catch(error){
                  socket.emit("custom_error",error)
                }
                })
    }




    sendMessage = (socket:IAuthSocket,io:Server)=>{
        socket.on("send_message",async({content,sendTo}:{sendTo:string,content:string})=>{
            try{
                console.log({content,sendTo})
                await chatService.sendMessage(content,sendTo,socket.data.user._id.toString())
                const receiverSocketIds= await this.radisService.getSockets(sendTo)
                if(receiverSocketIds.length){
                     socket.to(receiverSocketIds).emit("new_message",{content,sendTo})
                }
              
            }catch(error){
                socket.emit("custom_error",error)
            }
        })
    }




    sendGroupMessage = (socket:IAuthSocket,io:Server)=>{
        socket.on("send_group_message",async({content,groupId}:{groupId:string,content:string})=>{
            try{
                console.log({content,groupId})
                await chatService.sendGroupMessage(content,groupId,socket.data.user._id.toString())
                const receiverSocketIds= await this.radisService.getSockets(groupId)
                if(receiverSocketIds.length){
                     socket.to(receiverSocketIds).emit("new_message",{content,groupId})
                }
              
            }catch(error){
                socket.emit("custom_error",error)
            }
        })
    }




    joinGroup = (socket: IAuthSocket, io: Server) => {
  socket.on("join_group", async ({ roomId }: { roomId: string }) => {
    try {
      console.log({ roomId });

      socket.join(roomId); 

      await this.radisService.addSocket(roomId, socket.id);

    } catch (error) {
      socket.emit("custom_error", error);
    }
  });
};
}


export const chatEvent = new ChatEvent()