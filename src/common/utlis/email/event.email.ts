import { EventEmitter } from "events";

export const emailEvent=new EventEmitter({});
emailEvent.on("sendEmail",async(fn)=>{
    try{
        await fn();
    }catch(error){
        console.error(`Failed to send email: ${error}  😈`);
    }
})