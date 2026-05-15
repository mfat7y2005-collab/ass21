import{ z}from "zod";
import { generalValidationFileds } from "../../common/validation";



export const resendConfirmEmail = {
   body: z.strictObject({
     
        email:generalValidationFileds.email
    
     })

}
export const confirmEmail = {
   body: z.strictObject({
     
        otp:generalValidationFileds.otp
    
     })

}
export const loginSchema = {
   body: resendConfirmEmail.body.safeExtend({
     
        email:generalValidationFileds.email,
        password:generalValidationFileds.password,
        FCM:z.string().optional()
     })

}




































export const signupSchema = {
  

    body: loginSchema.body.extend({
        username:generalValidationFileds.username,
        confirmPassword:generalValidationFileds.confirmPassword,
        phone:generalValidationFileds.phone.optional()
       
     }).superRefine((data, ctx) => {
        if(data.password !== data.confirmPassword){
            ctx.addIssue({
                code: "custom",
                message: "Passwords don't match",
                path: ["confirmPassword"]
            });
        }
        if(data.email.includes("test")){
            ctx.addIssue({
                code: "custom",
                message: "Email should not contain 'test'",
                path: ["email"]
            });
        }

        console.log({data, ctx});
    })


}

