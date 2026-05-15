import {resolve} from 'node:path';
import {config} from 'dotenv'
config({path:resolve(`./.env.${process.env.NODE_ENV || "development"}`)});


export const PORT=process.env.PORT ;
export const DB_URL=process.env.DB_URL;
export const REDIS_URL=process.env.REDIS_URL as string;
export const TOKEN_SYSTEM_SECRET_KEY = process.env.TOKEN_SYSTEM_SECRET_KEY;
export const TOKEN_SYSTEM_REFERSH_SECRET_KEY = process.env.TOKEN_SYSTEM_REFERSH_SECRET_KEY;
export const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY;
export const TOKEN_SECRET_REFERSH_KEY = process.env.TOKEN_SECRET_REFERSH_KEY;



export const region = process.env.AWS_REGION as string;
export const bucketName = process.env.AWS_BUCKET_NAME as string;
export const accessKeyId = process.env.AWS_ACCESS_KEY_ID as string;
export const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string;
export const expiresIn = Number(process.env.AWS_EXPIRES_IN) || 120;

