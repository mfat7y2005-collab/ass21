
import { FlattenMaps, QueryFilter } from "mongoose";
import { IChat } from "../../common/interfaces";
import { BaseRepository } from "../../DB/repository/base.repository";

import { ChatModel } from "../model";
import { ProjectionType } from "mongoose";
import { QueryOptions } from "mongoose";
import { HydratedDocument } from "mongoose";

export class ChatRepository extends BaseRepository<IChat> {

    constructor() {
        super(ChatModel);
    }





    async findOneChat({
            filter,
            projection,
            options,
            page,
            size
    
     }: {
         filter?: QueryFilter<IChat>,
              projection?: ProjectionType<IChat> | null | undefined,
              options?: QueryOptions<IChat>&{lean?: false} |
              null | undefined,
                page?:string|undefined|number,
            size?:string|undefined|number
     }
    
        
     ):Promise<HydratedDocument<IChat>|null>
    
    //lean true => return plain js object
      async findOneChat({
            filter,
            projection,
            options,
            page,
            size
    
     }: {
         filter?: QueryFilter<IChat>,
              projection?: ProjectionType<IChat>| null | undefined,
              options?: QueryOptions<IChat>&{lean?: true} |
              null | undefined,
                page?:string|undefined|number,
            size?:string|undefined|number
     }
    
        
     ):Promise<null|FlattenMaps<IChat>>



      async findOneChat({
            filter,
            projection,
            options,
            page="1",
            size="5"
    
     }: {
         filter?: QueryFilter<IChat>,
              projection?: ProjectionType<IChat> | null | undefined,
              options?: QueryOptions<IChat> | null | undefined
              page?:string | undefined | number,
            size?:string|undefined|number
     }
    
        
     ):Promise<HydratedDocument<IChat>|FlattenMaps<IChat>|null >{
        page=parseInt(page  as string)
        size=parseInt(size as string)
         const doc= this.model.findOne(filter,{
            messages:{$slice:[-(page*size),size]},
         });
            if(options?.lean)doc.lean(options.lean);
            return await doc.exec() 
     }

}