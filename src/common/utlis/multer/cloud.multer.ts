import type{ Request } from "express";
import  multer  from "multer";
import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import { StorageApprochEnum } from "../../enums";
import { fileFilter } from "./validation.multer";


export const cloudFileUpload = ({
        storageApproch=StorageApprochEnum.MEMORY,
        valdiation=[],
        maxSize=2
}:{
    storageApproch?:StorageApprochEnum,
    valdiation?:string[],
    maxSize?:number
}
)=>{
    // const storage = multer.memoryStorage()
    const storage=storageApproch==StorageApprochEnum.MEMORY?multer.memoryStorage(): multer.diskStorage({
        destination:function(req:Request,file:Express.Multer.File,callback: (error: Error | null, filename: string) => void){
             callback(null,tmpdir())
        },
        filename:function(req:Request,file:Express.Multer.File,callback: (error: Error | null, filename: string) => void){
              callback(null,`${randomUUID()}__${file.originalname}`)
        },
    })
    return multer({fileFilter:fileFilter(valdiation),storage,limits:{fileSize:maxSize*1024*1024}})
}