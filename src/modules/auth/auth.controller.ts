import { Router } from "express";
import type{Request,Response,NextFunction}from "express"
import  authservice  from "./auth.service";
import { successResponse } from "../../common/response";
import{confirmEmail,resendConfirmEmail}from "./auth.valdiation"


import { loginSchema, signupSchema } from "./auth.valdiation";

import { valdiation } from "../../middleware";


const router = Router();
//-----------------------signup----------------------------------
router.post("/signup", valdiation(signupSchema), async (req:Request, res:Response) => {
//     try {
//         // console.log(req.body);
//        const value= signupSchema.body.parse(req.body);//لو بتاخد وقت هعمل parseAsync ودي طبعا بتاخد async await
//        console.log({value,body:req.body})
//     } catch (error) {
//         if (error instanceof Error) {
//   throw new BadRequestException("Invalid input data", {
//     cause: error.message,
//   });
// }
//     }
//     const result=authservice.signup(req.body);
//    successResponse<TSignupResponse>({res,data:result,status:201})

//****************************************************


//safeparse بقدر امسك فيها ال vaLUE  وال result

    // const valditionResult=await signupSchema.body.safeParseAsync(req.body);
    // console.log({valditionResult});
    // if(!valditionResult.success){
    //     return res.status(400).json({error:valditionResult.error})
    // }
    await authservice.signup(req.body);
   successResponse({res,status:201})


}); 


//-----------------------login----------------------------------
router.post("/login", valdiation(loginSchema), (req:Request, res:Response,next:NextFunction) => {
        const result=authservice.login(req.body,`${req.protocol}://${req.host}`);
    successResponse({res,data:result,status:200})
}); 


//-----------------------logout----------------------------------
// router.post("/logout",  (req:Request, res:Response) => {
//     const result=authservice.signup(req.body);
//    successResponse<TSignupResponse>({res,data:result,status:201})
// });

//-----------------------forgot-password-------------------------------
router.post("/forgot-password", (req:Request, res:Response) => {
    res.send("Forgot Password successful");
});

  router.patch("/confirm-email",
    valdiation(confirmEmail),
    async(req,res,next)=>{
        await authservice.confirmEmail(req.body)
        return successResponse({res})
    })

router.patch("/resend-confirm-email",
    valdiation(resendConfirmEmail),
    async(req,res,next)=>{
        await authservice.confirmEmail(req.body)
        return successResponse({res})
    }


)


export default router;