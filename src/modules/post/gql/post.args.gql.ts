import { GraphQLEnumType, GraphQLID, GraphQLInt, GraphQLNonNull,  GraphQLString } from "graphql";
export const ReactGQLEnumType =new GraphQLEnumType({
     name:"react on post enum",
        values:{
            DisLike:{value:0},
            Like:{value:1},

        }
})


export const postList ={
    page:{type:GraphQLInt},
    size:{type:GraphQLInt},

    search:{type:GraphQLString},
     
}



export const reactOnPost ={
    postId:{type:new GraphQLNonNull(GraphQLID)},
    react:{type:ReactGQLEnumType
       
        }
  
     
}