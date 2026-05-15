import{ z} from 'zod'
import { AvailabilityEnum } from '../../common/enums'
import {  Types } from 'mongoose'
import { generalValidationFileds } from '../../common/validation'
import { fileFieldValidation } from '../../common/utlis/multer'
export const createPost =
{
    body:z.strictObject({
        content:z.string().optional(),
            files:z.array(generalValidationFileds.file(fileFieldValidation.image)).optional(),
            tags:z.array(z.string()).optional(),
            availability:z.coerce.number().default(AvailabilityEnum.PUBLIC)
 } ).superRefine((args,ctx)=>{
    if(!args.files?.length&&!args.content){
        ctx.addIssue({
            code:"custom",
            path:['content'],
            message:"Content is requried"
        })

        if(args.tags?.length ){
            const uniqueTags =[...new Set(args.tags)]
            if(uniqueTags.length != args.tags.length){
                ctx.addIssue({
                     code:"custom",
            path:['tags'],
            message:"Duplicated Tags"
                })
            }
            for(const tag of args.tags){
                if(!Types.ObjectId.isValid(tag)){
                      ctx.addIssue({
                     code:"custom",
            path:['tags'],
            message:`Invalid tagged objectid ${tag}`
                })
                }
            }
        }
    }
 })
}

export const updatePost =
{

    
    params:z.strictObject({
        postId:generalValidationFileds.id
    }),
    body:z.strictObject({
        content:z.string().optional(),
            removeFile:z.array(z.string()).optional(),
            removeTags:z.array(z.string()).optional(),


            files:z.array(generalValidationFileds.file(fileFieldValidation.image)).optional(),
            tags:z.array(generalValidationFileds.id).optional(),
            availability:z.coerce.number().optional()
 } ).superRefine((args,ctx)=>{
    if(!Object.values(args)?.length){
        ctx.addIssue({
            code:"custom",
           
            message:"Insert Data to update"
        })

        if(args.tags?.length ){
            const uniqueTags =[...new Set(args.tags)]
            if(uniqueTags.length != args.tags.length){
                ctx.addIssue({
                     code:"custom",
            path:['tags'],
            message:"Duplicated Tags"
                })
            }
          
        }
    }
 })
}




export const reactPost =
{
    params:z.strictObject({
        postId:generalValidationFileds.id
    }),
    query:z.strictObject({
        react:z.coerce.number()
    
 } )
}


export const reactOnPostGQL =

    z.strictObject({
        postId:generalValidationFileds.id,
        react:z.coerce.number()

    })
  




    
