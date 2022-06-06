import { Router } from 'express'
import { ArticleRouter } from './articleRouter'
import { CommentRouter } from './commentRouter'

const v1 = ():Router => {
    const router = Router();
    ArticleRouter(router);
    CommentRouter(router);

    return router;
}

export { v1 }