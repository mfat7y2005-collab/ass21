
import userService, { UserService } from "../user.service"
import { IAuthUser } from "../../../common/types/express.types"
import { GQLAuthorization, GQLvaldiation } from "../../../middleware"
import { endpoint } from "../user.authorization"
import { profileGQL } from "../user.validation"





export class UserResolver {
    private userService:UserService
  
    constructor(){
        this.userService=userService
     
        this.profile = this.profile.bind(this)


    }


     profile=async (parent:unknown,args:any,{user}:IAuthUser)=> {

       await GQLAuthorization(endpoint.profile,user)
        await GQLvaldiation<{search?:string}>(profileGQL,args)
        const data = await this.userService.profile(user)
                    return {message:`Hello`,data}
                }
}


export const userResolver = new UserResolver()