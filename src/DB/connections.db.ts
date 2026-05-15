import { connect } from "mongoose";
import { DB_URL } from "../config/config";
import { UserModel } from "./model";
export const connectionsDb = async () => {
    try {
await connect(DB_URL as string,
    {serverSelectionTimeoutMS: 30000} 
    );
        await UserModel.syncIndexes(); 
        console.log(`DB Connected Successfully 😎`);
    } catch (error) {
        console.error(`Failed to connect to the database ${error} 😈`);
    }
};