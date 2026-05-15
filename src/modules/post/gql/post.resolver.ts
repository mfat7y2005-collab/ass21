
import { PostService ,postService} from "../post.service"


import { IAuthUser } from "../../../common/types/express.types"
import { GQLvaldiation } from "../../../middleware"
import { PaginateDto, paginationValidationSchema } from "../../../common/validation"
import { reactOnPostGQL } from "../post.valdiation"
import { ReactOnPosArgsDto } from "../post.dto"




export class PostResolver {
    private postService:PostService

    constructor(){
        this.postService = postService

    }


    postList =  async(parent:unknown,args:PaginateDto,{user}:IAuthUser) =>{
        
                await GQLvaldiation<PaginateDto>(paginationValidationSchema.query,args)
        
        const data = await this.postService.postList(args,user)
        return {mesaage:"Done",data}

    }



     reactOnPost =  async(parent:unknown,{postId,react}:ReactOnPosArgsDto,{user}:IAuthUser) =>{
        
                await GQLvaldiation<ReactOnPosArgsDto>(reactOnPostGQL,{postId,react})
        
        const data = await this.postService.reactPost({postId},{react},user)
        return {mesaage:"Done",data}

    }
}

export const postResolver = new PostResolver()