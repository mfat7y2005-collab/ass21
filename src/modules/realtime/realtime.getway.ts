import { Server } from "socket.io"
import { IAuthSocket } from "../../common/types/express.types"
import { RadisService, TokenService } from "../../services"
import { Server as HttpServerType } from "node:http"
import { chatGateway } from "../chat"




export class RealtimeGateway {
    private io!:Server

    private tokenService:TokenService
    private redisService:RadisService
    constructor(){
        this.tokenService = new TokenService()
        this.redisService = new RadisService()
       
    }


    authintication =async(socket:IAuthSocket,next:any)=>{
                try{
                    console.log("IN")
                      const tokenService = new TokenService()
                const {user} = await tokenService.decodedToken({token:socket.handshake.auth.authorization})
               
                socket.data ={user , decoded:socket.handshake.auth.decoded}
        
                await this.redisService.addSocket(user._id,socket.id)
                next()
        
        
                }catch(error){
                   next(error)
                }
        
             }


    intializeIo=(httpServer:HttpServerType)=>{
         // const connection:string[]=[]
        
             this.io = new Server(httpServer,{
                cors:{
                    origin:"*"
                }
             })
             
             this.io.of("/").use(this.authintication)
        
        
            this.io.on("connection",async(socket:IAuthSocket)=>{
        
                // console.log(socket.data.decoded)
                console.log({connections:await this.redisService.getSockets(socket.data.user._id)})
        
            
              chatGateway.registerEvents(socket,this.io)
              
              
                socket.on("disconnect",async()=>{
                    console.log(socket.id,socket.data.user._id)
        
                    await this.redisService.removeSocket(socket.data.user._id,socket.id)
                    const connections=await this.redisService.getSockets(socket.data.user._id)
                   if(connections.length<1){
                    socket.emit("offline_user",{userId:socket.data.user._id})
                   }
             })
               })
    }
    getIo(){
        return this.io
    }

}


export const realtimeGateway = new RealtimeGateway()