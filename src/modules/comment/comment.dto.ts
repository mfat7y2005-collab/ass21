import{z} from'zod'
import { createComment, replyOnComment} from './comment.valdiation'

export type CreateCommentBodyDto = z.infer<typeof createComment.body>
export type CreateCommentParamsDto = z.infer<typeof createComment.params>
export type CreateReplyCommentParamsDto = z.infer<typeof replyOnComment.params>


