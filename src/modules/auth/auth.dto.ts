

export interface loginDTO {
    email: string;
    password: string;
    FCM?:string
}
export interface signupDTO extends loginDTO{
    username: string;
    phone: string;
}

export interface confirmEmailDto{
    otp:number
}

export interface resendConfirmEmailDto{
    email:string;
}
