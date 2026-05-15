import {  Response } from "express";

import { notificationService } from "../services";
import { notificationModel } from "../DB/model/notification.model";

export const sendAdminNotification = async (req: any, res: Response) => {
    try {

    
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Admin Only Allowed" });
        }

        const { title, body, token, userId } = req.body;

       
       await notificationService.sendNotification({
        token,
         data: { title, body }
});

      const notification = await notificationModel.create({
            title,
            body,
            userId,
            sentBy: req.user._id
        });

        return res.status(201).json({
            message: "Notification Sent Successfully",
            notification
        });

    } catch (error: any) {
        return res.status(500).json({ message: error.message });
    }
};