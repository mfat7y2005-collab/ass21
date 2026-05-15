import { type NextFunction, Request, Response } from "express";
import { authentication, valdiation } from "../../middleware";
import { cloudFileUpload, fileFieldValidation } from "../../common/utlis/multer";
import { successResponse } from "../../common/response";
import{Router} from "express";
import * as validators from './comment.valdiation'
import { commentService } from "./comment.service";
import { CreateCommentParamsDto, CreateReplyCommentParamsDto } from "./comment.dto";
import { IComment } from "../../common/interfaces";

const router = Router()

router.post(
    "/",
    authentication(),
     cloudFileUpload({valdiation:fileFieldValidation.image}).array("files",2),
    valdiation(validators.createComment),
    async(req:Request,res:Response,next:NextFunction)=>{
        const data = await commentService.createComment(req.params as CreateCommentParamsDto,{...req.body,files:req.files},req.user)
        return successResponse<IComment>({res,status:201,data})
    }
)





router.post(
    "//commentId/reply",
    authentication(),
     cloudFileUpload({valdiation:fileFieldValidation.image}).array("files",2),
    valdiation(validators.replyOnComment),
    async(req:Request,res:Response,next:NextFunction)=>{
        const data = await commentService.replyOnComment(req.params as CreateReplyCommentParamsDto,{...req.body,files:req.files},req.user)
        return successResponse<IComment>({res,status:201,data})
    }
)


export default router