


import * as PostGQLTypes from './post.types.gql'
import * as PostGQLArgs from './post.args.gql'
import { PostResolver,postResolver } from './post.resolver'



export class PostGQLSchema{
    private postResolver :PostResolver
    constructor(){
        this.postResolver=  postResolver

    }


    registerQuery(){
        return{
            postList:{
                type:PostGQLTypes.postList,
                args:PostGQLArgs.postList,
                resolve:this.postResolver.postList
            }

        }
    }


    registerMutation(){
        return{
            reactPost:{
                type:PostGQLTypes.reactOnPost,
                args:PostGQLArgs.reactOnPost,
                resolve:this.postResolver.reactOnPost,
            }
           

        }
    }
}

export const postGQLSchema=new PostGQLSchema()