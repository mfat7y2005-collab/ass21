import{z} from'zod'
import { createPost, reactOnPostGQL, reactPost, updatePost } from './post.valdiation'


export type CreatePostBodyDto = z.infer<typeof createPost.body>
export type ReactPosQueryDto = z.infer<typeof reactPost.query>
export type ReactPosParamsDto = z.infer<typeof reactPost.params>


export type UpdatePosBodyDto = z.infer<typeof updatePost.body>
export type UpdatePosParamsDto = z.infer<typeof updatePost.params>

export type ReactOnPosArgsDto = z.infer<typeof reactOnPostGQL>

