export interface INotificationData {
    title: string;
    body: string;
    imageUrl?: string;
}

export interface ISendNotification {
    token: string;
    data: INotificationData;
}