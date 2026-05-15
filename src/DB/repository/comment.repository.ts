
import { Model } from "mongoose";
import { IComment } from "../../common/interfaces";
import { BaseRepository } from "../../DB/repository/base.repository";
import { commentModel } from "../model";

export class CommentRepository extends BaseRepository<IComment> {

    constructor(model: Model<IComment> = commentModel) {
        super(model);
    }

}