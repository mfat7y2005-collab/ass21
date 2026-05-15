
import { Types } from "mongoose";
import { z} from "zod";



export const generalValidationFileds={
    id:z.string().refine(value=>{return Types.ObjectId.isValid(value)},"Invalid ObjectId"),
      email:z.email({error: "Please provide a valid email"}),
        password:z.string({error: "Password must be at least 6 characters long"}).
        regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
            {message: "Password must be at least 6 characters long and contain both letters and numbers"}),
     username:z.string({error: "Username must be between 2 and 20 characters"}).min(2,{error: "Username must be at least 2 characters long"}).max(20),
     otp:z.string({error:"otp is requrid"}).regex(/^=\d{6}$/),
    phone:z.string({error: "Please provide a valid phone number"}).regex(/^(010|011|012|015)[0-9]{8}$/, {message: "Please provide a valid phone number"}),
        confirmPassword:z.string({error: "Confirm Password must be at least 6 characters long"}),
      file: function (mimetype: string[]) {
    return z.strictObject({
      fieldname: z.string(),
      originalname: z.string(),
      encoding: z.string(),
      mimetype:z.enum(mimetype),
      buffer: z.any().optional(),
      path: z.string().optional(),
      size: z.number()

    }).superRefine((args, ctx) => {
      if (!args.path && !args.buffer) {
        ctx.addIssue({ code: "custom", message: "buffer is required", path: ["buufer"] })
      }
    })
  }  
}

export const paginationValidationSchema ={
    query:z.strictObject({
        page:z.coerce.number().optional(),
        size:z.coerce.number().optional(),
        search:z.string().optional(),


    })
}

export type PaginateDto = z.infer<typeof paginationValidationSchema.query>