


import { Model } from "mongoose";
import { IUser } from "../../common/interfaces";
import { BaseRepository } from "../../DB/repository/base.repository";
// import { UserModel } from "../models/user.model";
import { UserModel } from "../../DB/model/user.model";

export class UserRepository extends BaseRepository<IUser> {

    constructor(model: Model<IUser> = UserModel) {
        super(model);
    }

}


export const userRepository =new UserRepository()