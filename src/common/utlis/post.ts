import { HydratedDocument } from "mongoose"
import { AvailabilityEnum } from "../enums"
import { IUser } from "../interfaces"

export const getAvailability = (user:HydratedDocument<IUser>)=>{
    return[
                        {
                            availability:AvailabilityEnum.PUBLIC
                        },
                        {
                           availability:AvailabilityEnum.ONLY_ME,crearedBy:user._id
                        },
                        {
                            availability:AvailabilityEnum.FRINDS,crearedBy:{$in:[user._id,...(user.friends||[])]}
                        },
                        {
                            tags:{$in:[user._id]}
                        },
                    ]
}