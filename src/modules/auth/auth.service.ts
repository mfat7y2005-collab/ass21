// export const login = (data: any) : string => {
//     return "Done😘😘";
// };


//single ton instance of class✈️✈️


// import { generateHash } from "../../common/utlis/security";

import { EmailEnum } from "../../common/enums";
import { emailEvent, emailTemplate, sendEmail } from "../../common/utlis/email";
import { UserModel } from "../../DB/model";
import { UserRepository } from "../../DB/repository/user.repository";
import { NotificationService,notificationService, RadisService, redisService, SecurityServices, TokenService } from "../../services";
import { loginDTO, signupDTO } from "./auth.dto";
 import { createRandomOTP } from "../../common/utlis/otp";
// import { promises } from "node:dns";
import { compareHash } from "../../common/utlis/security";




 



 

class AuthService {
    private readonly userRepository :UserRepository;
    private readonly securityServices:SecurityServices;
    private readonly redis:RadisService;
    private readonly tokenService:TokenService
    private readonly notification:NotificationService
    // private users:any[]=[]; // This is just a placeholder for user data storage. In a real application, you would use a database.

     constructor() {
            this.userRepository = new UserRepository(UserModel);
            this.tokenService=new TokenService();
            this.securityServices = new SecurityServices();
            this.redis = redisService;
            this.notification=notificationService
        // Initialize any necessary properties or dependencies here
        // this.signup=this.signup.bind(this); // Bind the signup method to the instance
    }
    // public async login({email,password,FCM}:loginDTO,issuer:string):Promise<string>{
       
    //     const user = await this.userRepository.findOne({
    //         filter:{ 
    //             email,
                
    //             confirmEmail:{ $exists:true}

    //         },
    //     }) ;
    //     if(!user){
    //          throw new Error("Invalid login. 😈");
    //     }
    //     if(!await compareHash({plaintext:password ,cipherText:user.password})){
    //          throw new Error("Invalid login. 😈");
    //     }
    //     if(FCM){
    //         await this.redis.addFCM(user._id,FCM)
    //         const tokens = await this.redis.getFCMs(user._id)
            
    //         if(tokens?.length){
    //             await this.notification.sendNotification({  tokens ,data:{title:"login",body:`New login at ${new Date()}`}})

    //         }
    //     }
    //     return await this.tokenService.sign({payload:{ sub:user.id}})

    // }


    public async login({ email, password, FCM }: loginDTO, issuer: string): Promise<string> {

    const user = await this.userRepository.findOne({
        filter: {
            email,
            confirmEmail: { $exists: true },
        },
    });

    if (!user) {
        throw new Error("Invalid login. 😈");
    }

    if (!await compareHash({ plaintext: password, cipherText: user.password })) {
        throw new Error("Invalid login. 😈");
    }

    if (FCM) {
        await this.redis.addFCM(user._id.toString(), FCM);

        const tokens = await this.redis.getFCMs(user._id.toString());

        if (tokens?.length) {
            await this.notification.sendNotifications({
                tokens,
                data: {
                    title: "login",
                    body: `New login at ${new Date()}`,
                },
            });
        }
    }

    return await this.tokenService.sign({
        payload: { sub: user.id },
    });
}

    
    private async sendOtpEmail({email,subject,title}:{email:string,subject:EmailEnum,title:string}){
        const isBlocked=await this.redis.exists(this.redis.blokOtpKey({email,subject}));
        if(isBlocked){
            throw new Error("Too many attempts. Please try again later. 😈");
        }
        const remainingAttempts=await this.redis.ttl(this.redis.otpKey({email,subject}));
        if(remainingAttempts>0){
            throw new Error(`OTP already sent. Please wait ${remainingAttempts} seconds before requesting a new one. 😈`);
        }
        const maxTrial= await this.redis.get(this.redis.maxAttemptsKey({email,subject}));
        if(maxTrial && parseInt(maxTrial)>=5){
            await this.redis.set({key:this.redis.blokOtpKey({email,subject}),value:"blocked",ttl:60*15});
            throw new Error("Too many attempts. Please try again later. 😈");
        }
        const code= createRandomOTP();
        await this .redis.set({
            key:this.redis.otpKey({email,subject}),
            value:code,
            ttl:60*5   
        })
        emailEvent.emit("send_email", async()=>{
            await sendEmail({
                to:email,
                subject,
                html:emailTemplate({code,title})
            })
            await this.redis.incr(this.redis.maxAttemptsKey({email,subject}));
        })
    }
     public async confirmEmail({email,otp}:{email:string,otp:string}){
        const storedOtp=await this.redis.get(this.redis.otpKey({email,subject:EmailEnum.COONFIRM_EMAIL}));
        if(!storedOtp){
            throw new Error("OTP expired or not found. Please request a new one. 😈");
        }
        const account = await this.userRepository.findOne({
            filter:{email,confirmEmail:{$exists:false}} 

        });
        if(!account){
            throw new Error("Account not found or already confirmed. 😈");
        }
        if(!await this.securityServices.compareHash({plaintext:otp,cipherText:storedOtp})){
            throw new Error("Invalid OTP. Please try again. 😈");
        }
        account.confirmEmail=new Date()
        await account.save();
        await this.redis.delete(this.redis.otpKey({email,subject:EmailEnum.COONFIRM_EMAIL}));
        return "Email confirmed successfully! 🎉";
    }
       

    public async resendConfirmEmail({email}:{email:string}){
const account =await this.userRepository.findOne({
       filter:{email,confirmEmail:{$exists:false}}


})
    if(!account){
            throw new Error("Account not found or already confirmed. 😈");
        }
     await this.sendOtpEmail({email,subject:EmailEnum.COONFIRM_EMAIL,title:"verfy Email"})
    }




    // login(data: loginDTO): string {
    //     console.log({this:this})
    //     return "Done login😘😘";
    // }

    //DTOبالعادة بنستخدم ال DTO عشان نحدد شكل البيانات اللي هتدخل ال API بتاعتنا، بس هنا انا عشان ابسط الموضوع شوية هستخدم ال any
    async signup(data: signupDTO): Promise<string> {
        console.log(data)
        let { email, password, username, phone} = data;
        console.log({ email, password, username, phone })
        // const user = await UserModel.create({ email, password,  username });
        const checkUserExist = await this.userRepository.findOne({
            filter:{email},
            projection: "email",
            options: {lean:false}
        });
        console.log({checkUserExist})
        if(checkUserExist){
            checkUserExist.email="updated email";
                await checkUserExist.save();
            throw new Error("User already exists 😈");
        }

        const user = await this.userRepository.createone({
            data:{ 
                email,
                password,
                username,
                phone:phone as string
            }
        })||[];
        if(!user){
            throw new Error("Failed to create user");
        }
        await this.sendOtpEmail({email,subject:EmailEnum.COONFIRM_EMAIL,title:"verify account"}).catch(err=>{
            console.error("Failed to send OTP email:", err);
        });
        return "Done signup😘😘";
        // console.log(ll)
        // throw new Error("Method not implemented.",{cause:{status:400,extra:"lol"}});
        // throw new BadRequestException("Method not implemented.");
        // console.log({this:this})
        // return { email, password };



        // await sendEmail({to:email,subject:"Confirm_Email",html:emailTemplate({code:"123456",title:"verify account"})})
        // return "Done signup😘😘";
        // console.log(ll)
        // throw new Error("Method not implemented.",{cause:{status:400,extra:"lol"}});
        // throw new BadRequestException("Method not implemented.");
        // console.log({this:this})
        // return { email, password };
        
    // }
    // signup=(req:Request, res:Response) => {
    //     console.log({signup:this})
        
        
    //     res.send("Signup successful " );
    // }


   
}   







//---------------------Gmail----------------------------------------------------


//   // ================= SIGNUP =================
//   signup = async ({ email, password, username }: any) => {
//     const existingUser = await UserModel.findOne({ email });

//     if (existingUser) {
//       throw new Error("User already exists");
//     }

//     const user = await UserModel.create({
//       email,
//       username,
//       password, // يفضل hash
//     });

//     return {
//       message: "User created successfully",
//       user,
//     };
//   };

//   // ================= CONFIRM EMAIL =================
//   confirmEmail = async ({ email, otp }: any) => {
//     const storedOtp = await this.redis.get(`otp:${email}`);

//     if (!storedOtp) {
//       throw new Error("OTP expired");
//     }

//     if (storedOtp !== otp) {
//       throw new Error("Invalid OTP");
//     }

//     const user = await UserModel.findOne({ email });

//     if (!user) {
//       throw new Error("User not found");
//     }

//     user.isEmailVerified = true;
//     await user.save();

//     await this.redis.delete(`otp:${email}`);

//     return {
//       message: "Email confirmed successfully",
//     };
//   };

//   // ================= LOGIN =================
//   login = async ({ email, password }: any) => {
//     const user = await UserModel.findOne({ email });

//     if (!user) {
//       throw new Error("Invalid credentials");
//     }

//     // ⚠️ replace with bcrypt in production
//     const isMatch = user.password === password;

//     if (!isMatch) {
//       throw new Error("Invalid credentials");
//     }

//     const accessToken = await this.tokenService.sign({
//       payload: {
//         id: user._id,
//         role: user.role,
//       },
//       secret: process.env.JWT_SECRET as string,
//       options: {
//         expiresIn: "15m",
//         audience: "access",
//       },
//     });

//     const refreshToken = await this.tokenService.sign({
//       payload: {
//         id: user._id,
//         role: user.role,
//       },
//       secret: process.env.JWT_REFRESH_SECRET as string,
//       options: {
//         expiresIn: "7d",
//         audience: "refresh",
//       },
//     });

//     return {
//       user,
//       accessToken,
//       refreshToken,
//     };
//   };
// }


//---------------------------------------------------------------------------------














}
export default new AuthService();       