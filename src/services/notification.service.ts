import admin from 'firebase-admin'

export class NotificationService{
    private client:admin.app.App
    constructor(){
        // var serviceAccount=require("path/to/serviceAccountKey.json")
        this.client=admin.initializeApp({
            // credential:admin.credential.cert(serviceAccount)
        })
        
    }

    async sendNotification({
          token,
            data

    }:{
        token:string,
        data:{title:string,body:string}
    }){
       

        const message ={
            token,
            data
        }

        return await this.client.messaging().send(message)
    }








    
    async sendNotifications({
          tokens,
            data

    }:{
        tokens:string[],
        data:{title:string,body:string}
    }){
       

      await Promise.allSettled(
        tokens.map(token=>{
            return this.sendNotification({token,data})
        })
      )

    }
}
export const notificationService =new NotificationService()