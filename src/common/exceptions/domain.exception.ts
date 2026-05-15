


import { GraphQLError } from "graphql";
import { ApplicationException } from "./application.exception";


export const MapGraphQLError =(error:ApplicationException)=>{
    throw new GraphQLError(
        error.message||'internalServerError',
        {
            extensions:{
                statusCode:error.statusCode || 500,
                cause:error.cause
            }
        }

        
    )
}

export class NotFoundException extends ApplicationException{
    constructor(message: string="Not Found",cause?:unknown) {
        super(message,404,cause);

    }
}
export class BadRequestException extends ApplicationException{
    constructor(message: string="Bad Request",cause?:unknown) {
        super(message,400,cause);
    }
}
export class UnauthorizedException extends ApplicationException{
    constructor(message: string="Unauthorized",cause?:unknown) {
        super(message,401,cause);
    }
}
export class ForbiddenException extends ApplicationException{
    constructor(message: string="Forbidden",cause?:unknown) {
        super(message,403,cause);
    }   
}
export class InternalServerErrorException extends ApplicationException{
    constructor(message: string="Internal Server Error",cause?:unknown) {
        super(message,500,cause);
    }
}

export class MethodNotAllowedException extends ApplicationException{
    constructor(message: string="Method Not Allowed",cause?:unknown) {
        super(message,405,cause);
    }
}

export class ConflictException extends ApplicationException{
    constructor(message: string="Conflict",cause?:unknown) {
        super(message,409,cause);
    }   
}

export class UnprocessableEntityException extends ApplicationException{
    constructor(message: string="Unprocessable Entity",cause?:unknown) {
        super(message,422,cause);
    }   
}  


