import { HydratedDocument, model, models,  Schema } from "mongoose";
import { IUser } from "../../common/interfaces";
import { GenderEnum ,RoleEnum} from "../../common/enums";
import { generateEncryption, generateHash } from "../../common/utlis/security";
import { sendEmail } from "../../common/utlis/email";
import { Types } from "mongoose";





const userSchema = new Schema<IUser>({
    firstName:{ type: String, required:false },
    lastName:{ type: String, required: false },
    slug:{type: String,required:true},
    email:{ type: String, required: true, unique: true },
    password:{ type: String, required: true },
    bio:{ type: String, maxlength: 200 },
    phone:{ type: String, required: false },
    profileImage:{ type: String },
    coverImage:{ type: [String] },
    DOB:{ type: Date },
    confirmedAt:{ type: Date },
    gender:{ type: Number, enum:GenderEnum ,default:GenderEnum.MALE },
    role:{ type: Number, enum:RoleEnum,default:RoleEnum.USER },
    deletedAt:{type:Date},
    restoredAt:{type:Date},

friends:[{type:Types.ObjectId,ref:"user"}],


    extra:{name:String}
  
},{
   timestamps:true,
   strict:true,
   strictQuery:true,
   collection:"SOCIAL_APP_Users",
   toObject:{
    virtuals:true
   },
   toJSON:{
    virtuals:true
   }

})


userSchema.virtual("username").get(function(this:IUser){
    return `${this.firstName} ${this.lastName}`;
}).set(function(this:IUser, value:string){
    const [firstName, lastName] = value.split(" ");
    this.firstName = firstName as string;
    this.lastName = lastName as string  ;
    this.slug= value.replaceAll(/\s+/g ,"-")
})



userSchema.pre("save",async function(){
    console.log("pre one ", this);
    // console.log(this.modifiedPaths(),this.isModified("password"))//دي بتقولك اي الحاجات اللي حصلها تغيير 
    //    console.log(this.isDirectModified("extra"))
       console.log(this.directModifiedPaths())//هتجيبلك ال field اللي اتغيرت مباشرة 
    //    this.isDirectSelected()
    // this.isSelected()
    // this.isInit() //مثلا  دي حاجه بخدها من ال database وبرجعها فيها تغيرات 
    // this.isNew()//هل هو  document جديد ولا لا 


       if(this.isModified("password")){
        this.password= await generateHash ({plaintext:this.password})
       }
    if(this.phone&& this.isModified("phone")){
        this.phone=await generateEncryption(this.phone)
    }
})

userSchema.post("save",async function(){
    const that = this as HydratedDocument<IUser>&{wasNew:boolean}
    console.log({post:that.isNew});
    if(that.wasNew){
        await sendEmail({to: this.email,subject:"confirm emai" , html:"ghfchncf"})
    }
})

userSchema.pre("updateOne",{document:true},function(){
    console.log(this);
    //deleteOne نفس الكلام 
    

})

userSchema.pre("findOne",function(){
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


userSchema.pre(["updateOne","findOneAndUpdate"],function(){
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





userSchema.pre(["deleteOne","findOneAndDelete"],function(){
   
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

export const UserModel =models.User || model<IUser>("User", userSchema)