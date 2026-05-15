import { type NextFunction, Request, Response } from "express";
import { authentication, valdiation } from "../../middleware";
import { cloudFileUpload, fileFieldValidation } from "../../common/utlis/multer";
import { successResponse } from "../../common/response";
import{Router} from "express";
import * as validators from './post.valdiation'
import { postService } from "./post.service";
import { PaginateDto, paginationValidationSchema } from "../../common/validation";
import { ReactPosParamsDto, ReactPosQueryDto, UpdatePosBodyDto, UpdatePosParamsDto } from "./post.dto";


const router = Router({mergeParams:true})


router.post(
    "/",
    authentication(),
    valdiation(paginationValidationSchema),
    async(req:Request,res:Response,next:NextFunction)=>{
        const data = await postService.postList(req.query as PaginateDto,req.user)
        return successResponse({res,status:201,data})
    }
)




// router.post(
//     "/",
//     authentication(),
//     cloudFileUpload({valdiation:fileFieldValidation.image}).array("attachments",2),
//      valdiation(validators.createPost),
//     async(req:Request,res:Response,next:NextFunction)=>{
//         const data = await postService.createPost({...req.body,files:req.files},req.user)
//         return successResponse({res,status:201,data})
//     }






    
// )







router.patch(
    "/postId",
    authentication(),
    cloudFileUpload({valdiation:fileFieldValidation.image}).array("files",2),

 
     valdiation(validators.updatePost),
    async(req:Request,res:Response,next:NextFunction)=>{
    
        const data = await postService.updatePost(req.params as UpdatePosParamsDto,req.body  as UpdatePosBodyDto,req.user)
        return successResponse({res,status:201,data})
    }
)





router.patch(
    "/postId/react",
    authentication(),
 
     valdiation(validators.reactPost),
    async(req:Request,res:Response,next:NextFunction)=>{
    
        const data = await postService.reactPost(req.params as ReactPosParamsDto,req.query as unknown as ReactPosQueryDto,req.user)
        return successResponse({res,status:201,data})
    }
)
export default router