 import {  GraphQLObjectType, GraphQLSchema } from "graphql";
import { userGQLSchema } from "../user";
import { postGQLSchema } from "../post";
 



const query=new GraphQLObjectType({
          
            name:"RootSchemaQuery",
            description:"optional text to enhance understand api",
            fields:{
              ...userGQLSchema.registerQuery(),
              ...postGQLSchema.registerQuery()
        }
        });
        const mutation=new GraphQLObjectType({
            name:"RootSchemaMutation",
            description:"optional text to enhance understand api",
            fields:{
              ...userGQLSchema.registerMutation(),
              ...postGQLSchema.registerMutation()
        }
        })





        export const schema= new GraphQLSchema({query,mutation})




 
//  export const schema= new GraphQLSchema({
//         query:new GraphQLObjectType({
//             name:"RootSchemaQuery",
//             description:"optional text to enhance understand api",
//             fields:{
//                 saiHi:{
//                 type: new GraphQLObjectType({
//                     name:"SayHiResponse",
//                     fields:{
//                         message:{type:GraphQLString}
//                     }
//                 }),
//                 resolve: (): {message:string}=>{
//                     return {message:"Hello"}
//                 }
//             },
//              welcome:{
//                 type:GraphQLString,
//                 description:"test welcome point",
//                 resolve: () =>{
//                     return "Hello world"
//                 }
//             }
//         }
//         }),
//          mutation:new GraphQLObjectType({
//             name:"RootSchemaMutation",
//             description:"optional text to enhance understand api",
//             fields:{
//                 saiHi:{
//                 type: new GraphQLObjectType({
//                     name:"SayHiResponse2",
//                     fields:{
//                         message:{type:GraphQLString}
//                     }
//                 }),
//                 resolve: (): {message:string}=>{
//                     return {message:"Hello"}
//                 }
//             },
//               welcome:{
//                 type:GraphQLString,
//                 description:"test welcome point",
//                 args:{
//                     search:{type:new GraphQLNonNull(GraphQLString),description:"search key"},
//                     name:{type:GraphQLString,description:"search key"},
//                     data:{type:new GraphQLInputObjectType({
//                         name:"input",
//                         fields:{
//                             match:{type:GraphQLBoolean}
//                         }
//                     })}


//                 },
//                 resolve: (parent:unknown,args:any) =>{
//                     console.log(args)
//                     return "Hello world"
//                 }
//             }
//         }
//         })
//     })