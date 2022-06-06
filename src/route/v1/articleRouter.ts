import { Router } from 'express'
import { getArticleList,
addArticle,
updateArticle,
deleteArticle } from '../../controller'

const ArticleRouter = (root:Router)=>{
    const router = Router();
    root.use('/article', router);
    
    router.get('/', getArticleList);
    router.post('/', addArticle);
    router.put('/:id', updateArticle);
    router.delete('/:id', deleteArticle);
}

export { ArticleRouter }