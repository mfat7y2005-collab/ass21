import { GraphQLEnumType, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { OneUserType } from "../../user/gql/user.types.gql";
import { AvailabilityEnum } from "../../../common/enums";

export const AvailabiltyGQLEnumType = new GraphQLEnumType({
    name:"AvailabiltyEnum",
    values:{
        public:{value:AvailabilityEnum.PUBLIC},
        Frinds:{value:AvailabilityEnum.FRINDS},
        Only_me:{value:AvailabilityEnum.ONLY_ME},


    }
})


export const OnePostType = new GraphQLObjectType({
    name:"OnePostType",
    fields:{
        id:{type:new GraphQLNonNull(GraphQLID)},
          folderId:{type:new GraphQLNonNull(GraphQLString)},
            content:{type:GraphQLString},

            attachments:{type:new GraphQLList(GraphQLString)},
            availability:{type:AvailabiltyGQLEnumType},
           
        
        
            likes:{type:new GraphQLList(OneUserType)},
            tags:{type:new GraphQLList(GraphQLString)},
            crearedBy:{type:new GraphQLNonNull(OneUserType)},
            updateddBy:{type:OneUserType},
        
            createdAt:{type:new GraphQLNonNull( GraphQLString)},
            deletedAt:{type:GraphQLString},
            restoredAt:{type:GraphQLString},
            updatedAt:{type:GraphQLString},

    }
})

export const postList = new GraphQLObjectType({
    name:"PostListResponse",
    fields:{
        message:{type:new GraphQLNonNull(GraphQLString)},
        data:{
            type:new GraphQLObjectType({
            name:"PostPaginationResponse",
            fields:{
                docs:{type:new GraphQLList(OneUserType)},
               
                      currentPage:{type:GraphQLInt},
                      pages:{type:GraphQLInt},
                      size:{type:GraphQLInt},
                    
                    
            }
        })}
    }
})

export const  reactOnPost = new GraphQLObjectType({
       name:"ReactOnPostResponse",
       fields:{
        message:{
            type:new GraphQLNonNull(GraphQLString)
        },
        data:{
            type:OneUserType

        }
         
                   

       }
})