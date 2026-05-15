import { type Request } from "express"
import{FileFilterCallback} from "multer";





export const fileFieldValidation={
    image:['image/jpeg','image/jpg','image/png'],
    video:['video/mp4']
}

export const fileFilter=(valdiation:string[])=>{
    return function(req:Request,file:Express.Multer.File,cb:FileFilterCallback){
      console.log(file.mimetype) 

      if(!valdiation.includes(file.mimetype)){
        return cb(new Error("Invalid File format"))
      }
    }
}