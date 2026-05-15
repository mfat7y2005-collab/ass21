import mongoose, { HydratedDocument, model, models,  Schema, Types } from "mongoose";
import { IChat, IMessage, IUser } from "../../common/interfaces";
import {  ChatEnum} from "../../common/enums";
import { string } from "zod";

const messageSchema = new Schema<IMessage>({
    
    
     content:{ type:string,required:function(this){
        return !this.attachments?.length
    } },
    deletedAt: { type: Date, default: null },
    attachments:{type: String,required:true},
  
   likes:[{ react:{
         type:Number,
      enum:[1,2,3,4,5,6],
           required:true
      },
      createdBy:{
         type:Types.ObjectId,
          ref:"User",
         required:true
        }
   }],
    tags:[{ type:Types.ObjectId,ref:"User"  }],
    createdBy:{ type:Types.ObjectId,ref:"User" ,required:true },
   

},{
      timestamps:true,
   strict:true,
   strictQuery:true,
   collection:"SOCIAL_APP_CHATS", 
   toJSON:{
    virtuals:true
   }
})

const chatSchema = new Schema<IChat>({



   participants:[{ type:Types.ObjectId,ref:"User"  ,required:true }],
    createdBy:{ type:Types.ObjectId,ref:"User" ,required:true },
    

   
    type:{ type: string, enum: ChatEnum, default:ChatEnum.ovo},


    //ovm
    group:({ type: String, required:function(this){
        return this.type === ChatEnum.ovm
    } }),
    groupImage:({ type: String, required:function(this){
        return this.type === ChatEnum.ovm
    } }),
    roomId:({ type: String, required:function(this){
        return this.type === ChatEnum.ovm
    } }),


     messages:[{ type: [messageSchema], required: true }],











    
  
    
    deletedAt: { type: Date},
  
    restoredAt:{type: Date},



  
},{
   timestamps:true,
   strict:true,
   strictQuery:true,
   collection:"SOCIAL_APP_CHATS", 
   toJSON:{
    virtuals:true
   }

})

// chat._id => comment.chatId
chatSchema.virtual("comments",{
    localField:"_id",
    foreignField:"chatId",
    ref:"Comment",
    justOne:true
})





// chatSchema.pre("save",async function(){
//     console.log("pre one ", this);
//     // console.log(this.modifiedPaths(),this.isModified("password"))//دي بتقولك اي الحاجات اللي حصلها تغيير 
//     //    console.log(this.isDirectModified("extra"))
//        console.log(this.directModifiedPaths())//هتجيبلك ال field اللي اتغيرت مباشرة 
//     //    this.isDirectSelected()
//     // this.isSelected()
//     // this.isInit() //مثلا  دي حاجه بخدها من ال database وبرجعها فيها تغيرات 
//     // this.isNew()//هل هو  document جديد ولا لا 


//        if(this.isModified("password")){
//         this.password= await generateHash ({plaintext:this.password})
//        }
//     if(this.phone&& this.isModified("phone")){
//         this.phone=await generateEncryption(this.phone)
//     }
// })

// chatSchema.post("save",async function(){
//     const that = this as HydratedDocument<IUser>&{wasNew:boolean}
//     console.log({chat:that.isNew});
//     if(that.wasNew){
//         await sendEmail({to: this.email,subject:"confirm emai" , html:"ghfchncf"})
//     }
// })



chatSchema.pre("findOneAndUpdate", async function () {

    const update = this.getUpdate() as any;

    if (!update?.deletedAt) return;

    const chatId = this.getQuery()?._id;

    const CommentModel = mongoose.models.Comment;

    if (!chatId || !CommentModel) return;

    await CommentModel.updateMany(
        { chatId },
        { deletedAt: new Date() }
    );
});







chatSchema.pre("updateOne",{document:true},function(){
    console.log(this);
    //deleteOne نفس الكلام 
    

})

chatSchema.pre(["findOne","find","countDocuments"],function(){
    console.log(this)
    console.log(this.getFilter())
    console.log(this.getQuery())
    const query= this.getQuery()
    if(query.pranoid === false){
         this.setQuery({...query})
    }else{
         this.setQuery({...query ,deletedAt:{$exists:false}})
    }
   


})


chatSchema.pre(["updateOne","findOneAndUpdate"],function(){
    const update=this.getUpdate() as HydratedDocument<IUser>;
    if(update.deletedAt){
        this.setUpdate({...update,$unset:{restoredAt:1}})
    }
    if(update.deletedAt){
        this.setUpdate({...update,$unset:{deletedAt:1}})
    }
    console.log(update)
    const query= this.getQuery()
    if(query.pranoid === false){
         this.setQuery({...query})
    }else{
         this.setQuery({deletedAt:{$exists:false},...query })
    }
   


})










chatSchema.pre(["deleteOne","findOneAndDelete"],function(){
   
    const query= this.getQuery()
    if(query.force === true){
         this.setQuery({...query})
    }else{
         this.setQuery({deletedAt:{$exists:false},...query })
    }
   


})

























// userSchema.pre("insertMany",function(docs){
//     console.log(this, docs);
  
    

// })

// userSchema.post("insertMany",function(docs,next){
//     console.log(this, docs);
//     next()
  
    

// })
  

// userSchema.pre("save",function(){
//     console.log("pre two ", this);
// })


// userSchema.pre("save", function(){
//     console.log(" POST SAVE ",this);
//     // next() بعمل كده لو عندي اكتر من parameter او ممكن اعمل async

// })



// userSchema.pre("save",function(){
//     console.log(" POST SAVE 2 ");
// })

// userSchema.pre("validate",function(){//valdiate بترن قبل اي query وقبل اي built in valdiation ----- valdiate جزء من save --- valdiatBeforeSave:true
//   console.log("pre valdiate")
//   if(this.password && this.provider == ProviderEnum.GOOGLE){
//     throw new Error("Google Account cannot hold password")

//   }
// }
// )




// userSchema.post("validate",function(){
//   console.log("pre valdiate")
//   if(!this.slug || this.slug.includes(" ")){
//      throw new Error("Invalid slug formate")
//   }
// }
// )

export const ChatModel = models.Chat || model<IChat>("Chat", chatSchema)