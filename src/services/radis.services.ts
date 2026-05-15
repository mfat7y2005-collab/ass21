import { createClient, RedisClientType } from "redis";
 import { REDIS_URL } from "../config/config";
import { EmailEnum } from "../common/enums";
import { Types } from "mongoose";


type RdisKeyType ={email:string,subject?: EmailEnum}

export class RadisService {
    private readonly client:RedisClientType;
    constructor() {
      this.client = createClient({url:REDIS_URL});
        this.handleEventrs();
    }
    private handleEventrs(){
        this.client.on("error",(err)=>{
            console.error(`Redis Client Error ${err} 😈`);
        });
        this.client.on("connect",()=>{
            console.log("Connecting to Redis...🔌");
        });
        this.client.on("ready",()=>{
            console.log("Redis Client is ready! 🚀");
        });
    }

    public async connect() {
        await this.client.connect();
        console.log("Connected to Redis successfully ✌️");
    }
    

    otpKey=({email,subject=EmailEnum.COONFIRM_EMAIL}:RdisKeyType)=>{
        return `otp:${subject}:${email}`;
    }
    maxAttemptsKey=({email,subject=EmailEnum.COONFIRM_EMAIL}:RdisKeyType):string=>{
        return `${this.otpKey({email,subject})}:maxAttempts`;
    }
    blokOtpKey=({email,subject=EmailEnum.COONFIRM_EMAIL}:RdisKeyType):string=>{
        return `${this.otpKey({email,subject})}:blocked`;
    }
    baseRevokeKey=({email,subject=EmailEnum.COONFIRM_EMAIL}:RdisKeyType):string=>{
        return `revoke:${subject}:${email}`;
    }
    revokeTokenKey=({email,subject=EmailEnum.COONFIRM_EMAIL}:RdisKeyType):string=>{
        return `${this.baseRevokeKey({email,subject})}:tokens`;
    }
    // General Redis operations
    //--------------set-------------------------

    set=async({
        key,
        value,
        ttl
    }:{
        key:string,
        value:any,
        ttl?:number | undefined
    }):Promise<string|null>=>{
        if(ttl){
            await this.client.set(key,value as string,{EX:ttl});
        }else{
            await this.client.set(key,value as string);
        }
        return null;
    }
    //--------------update-------------------------

    update=async({
        key,
        value,
        ttl
    }:{
        key:string,
        value:string | object,
        ttl?:number | undefined
    }):Promise<string|number|null>=>{
        if(ttl){
            await this.client.set(key,value as string,{EX:ttl});
        }else{
            await this.client.set(key,value as string);
        }
        return null;
    }
//--------------get-------------------------
    get=async(key:string):Promise<string|null>=>{
        const value=await this.client.get(key);
        return value;
    }

    ttl=async(key:string):Promise<number>=>{
        const ttl=await this.client.ttl(key);
        return ttl;
}
//--------------delete-------------------------
    delete=async(key:string):Promise<number>=>{
        const result=await this.client.del(key);
        return result;  
}
//--------------disconnect-------------------------
    disconnect=async():Promise<void>=>{
        await this.client.quit();
        console.log("Disconnected from Redis successfully ✌️"); 

}
//--------------exists-------------------------
   exists=async(key:string):Promise<number>=>{
    try {
        const exists=await this.client.exists(key);
        return exists;
    } catch (error) {        console.error(`Error checking key existence: ${error} 😈`);
    return 0;
   }
}
//--------------increment-------------------------
    incr=async(key:string):Promise<number>=>{
        try {
            const result=await this.client.incr(key);
            return result;
        } catch (error) {
            console.error(`Error incrementing key: ${error} 😈`);
            return 0;
        }
        
}
//--------------expire-------------------------
      expire=async({key, ttl}: {key:string, ttl:number}):Promise<number>=>{
        try {
            return await this.client.expire(key, ttl);
        } catch (error) {
            console.error(`Error setting key expiration: ${error} 😈`);
            return 0;
        }



}
//--------------mGet-------------------------
       mGet=async(keys:string[]):Promise<(string|null)[]>=>{
        try {
            const values=await this.client.mGet(keys);
            return values;
        } catch (error) {
            console.error(`Error getting multiple keys: ${error} 😈`);
            return [];
        }
    }
    //--------------keys-------------------------

    keys=async(pattern:string):Promise<string[]>=>{
        try {
            const keys=await this.client.keys(pattern);
            return keys;
        } catch (error) {
            console.error(`Error fetching keys with pattern ${pattern}: ${error} 😈`);
            return [];
        }
    }
    socketKey(userId: Types.ObjectId | string) {
  return `user:sockets:${userId.toString()}`;
}






    FCM_key(userId: Types.ObjectId | string) {
    return `user:FCM:${userId.toString()}`;
  }

  async addFCM(userId: Types.ObjectId | string, FCMToken: string) {
    return await this.client.sAdd(this.FCM_key(userId), FCMToken);
  }

  async removeFCM(userId: Types.ObjectId | string, FCMToken: string) {
    return await this.client.sRem(this.FCM_key(userId), FCMToken);
  }

  async getFCMs(userId: Types.ObjectId | string) {
    return await this.client.sMembers(this.FCM_key(userId));
  }

  async hasFCMs(userId: Types.ObjectId | string) {
    return await this.client.sCard(this.FCM_key(userId));
  }

  async removeFCMUser(userId: Types.ObjectId | string) {
    return await this.client.del(this.FCM_key(userId));
  }







   key(userId:Types.ObjectId|string) {
    return `user:sockets:${userId.toString()}`;
}
 async  addSocket(userId:Types.ObjectId|string, socketId:string) {
    return await this.client.sAdd(this.socketKey(userId), socketId);
}

 async  removeSocket(userId:Types.ObjectId|string, socketId:string) {
    return await this.client.sRem(this.socketKey(userId), socketId);
}

 async  getSockets(userId:Types.ObjectId|string) {
    return await this.client.sMembers(this.socketKey(userId));
}

 async  hasSockets(userId:Types.ObjectId|string) {
    return await this.client.sCard(this.socketKey(userId));
}

 async  removeUser(userId:Types.ObjectId|string) {
    return await this.client.del(this.socketKey(userId));
}


}
    export const redisService = new RadisService();