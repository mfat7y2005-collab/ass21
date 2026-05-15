import mongoose, { Schema, model } from "mongoose";

const notificationSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' }, 
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' } 
}, { timestamps: true });

export const notificationModel = mongoose.models.Notification || model("Notification", notificationSchema);