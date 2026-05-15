import { GraphQLEnumType, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { GenderEnum, RoleEnum } from "../../../common/enums";
import { ProviderEnum } from "../../../common/enums/provider.enums";
import { HydratedDocument } from "mongoose";
import { IUser } from "../../../common/interfaces";

export const GenderGQLEnumType = new GraphQLEnumType({
    name:"GraphQLEnumType",
    values:{
        Male:{value:GenderEnum.MALE},
        Femal:{value:GenderEnum.FEMALE},


    }
})

export const ProviderGQLEnumType = new GraphQLEnumType({
    name:"GraphQLEnumType",
    values:{
        Google:{value:ProviderEnum.GOOGLE},
        system:{value:ProviderEnum.SYSTEM},


    }
})


export const RoleGQLEnumType = new GraphQLEnumType({
    name:"GraphQLEnumType",
    values:{
        Admin:{value:RoleEnum.ADMIN},
        user:{value:RoleEnum.USER},
        


    }
})




export const OneUserType:GraphQLObjectType = new GraphQLObjectType({
    
    name:"OneUserType",
    fields:()=>({

         _id:{type: new GraphQLNonNull(GraphQLID)},

                                firstName:{type :new GraphQLNonNull(GraphQLString)},
                                    lastName:{type :new GraphQLNonNull(GraphQLString)},
                                    username:{type :GraphQLString,resolve:(parent:HydratedDocument<IUser>)=>{
                                        console.log(parent)
                                        return parent.gender===GenderEnum.MALE?`Mr:${parent.username}`:`Mis:${parent.username}`
                                    }
                                    },
                                    email:{type :new GraphQLNonNull(GraphQLString)
                                    },
                                    password:{type :GraphQLString},
                                    slug:{type :new GraphQLNonNull(GraphQLString)},
                                    phone:{type :GraphQLString},
                                    profileImage:{type :GraphQLString},
                                    coverImage:{type :new GraphQLList(GraphQLString)},




                                    DOB:{type :GraphQLString},
                                    confirmedAt:{type :GraphQLString},
                                    createdAt:{type :GraphQLString
                                    },
                                    updatedAt:{type :GraphQLString},
                                    confirmEmail:{type :GraphQLString},
                                    resendConfirmEmail:{type :GraphQLString},
                                    
                                     deletedAt:{type :new GraphQLNonNull( GraphQLString)},
                                     restoredAt:{type :GraphQLString},





                                     gender:{type:GenderGQLEnumType},
                                     provider:{type:ProviderGQLEnumType},

                                     role:{type:RoleGQLEnumType},


                                     friends:{type:new GraphQLList(OneUserType)}





    })


})





export const profile =new GraphQLNonNull(new GraphQLObjectType({
                    name:"profileResponse",
                    description:"test welcome response",
                    fields:{
                        message:{type:new GraphQLNonNull(GraphQLString)},
                        data:{
                            type:OneUserType
                        }
                    }
                }))