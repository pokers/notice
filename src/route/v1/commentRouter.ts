import { Router } from 'express'
import { getCommentList, addComment } from '../../controller'

const CommentRouter = (root:Router)=>{
    const router = Router();
    root.use('/comment', router);

    router.get('/', getCommentList);
    router.post('/', addComment);
}

export { CommentRouter }