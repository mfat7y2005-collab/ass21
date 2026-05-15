import { z } from "zod";
import { generalValidationFileds } from "../../common/validation";
import { fileFieldValidation } from "../../common/utlis/multer";

export const createComment = {
    params: z.strictObject({
        postId: generalValidationFileds.id
    }),

    body: z.strictObject({
        content: z.string().optional(),
        files: z.array(generalValidationFileds.file(fileFieldValidation.image)).optional(),
        tags: z.array(generalValidationFileds.id).optional(),
    }).superRefine((args, ctx) => {

        if (!args.files?.length && !args.content) {
            ctx.addIssue({
                code: "custom",
                path: ["content"],
                message: "Content is required"
            });
        }

        if (args.tags?.length) {
            const uniqueTags = [...new Set(args.tags)];

            if (uniqueTags.length !== args.tags.length) {
                ctx.addIssue({
                    code: "custom",
                    path: ["tags"],
                    message: "Duplicated Tags"
                });
            }
        }
    })
};



export const replyOnComment = {
    params: z.strictObject({
        postId: generalValidationFileds.id,
        commentId:generalValidationFileds.id
    }),

    body: createComment.body



};