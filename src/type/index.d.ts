import { ArticleModel } from "../repository/model";
import { NoticeRepository } from '../repository'
import { ArticleService, CommentService, NotifyService } from "../service"

export type Maybe<T> = T | null;

export type FirstLastItem<T> = {
    first: Maybe<T>;
    last: Maybe<T>;
}

export type Repos = {
    [key: string]: any;
    notice?:NoticeRepository
    // add here if there will be a new repository
}
export type Services = {
    [key: string]: any;
    article?: ArticleService
    comment?: CommentService
    notify?: NotifyService
    // add here if there will be a new service
}

export type ServerCfg = {
    port: number,
    host: string
}

export type DbCfg = {
    host:string, 
    port:number,
    username:string,
    password:string,
    database:string
}

export type Result<T> = {
    statusCode:number,
    data?:T
}|null|undefined

export type PageInfo = {
    // For infinite panination
    startCursor?: Maybe<string>;
    endCursor?: Maybe<string>;
    hasNextPage?: Maybe<Boolean>;
    hasPrevPage?: Maybe<Boolean>;
    // For general panination
    currentPage?: Maybe<number>;
    lastPage?: Maybe<number>;
    pageSize?: Maybe<number>;
}

// For article
export type ArticleQuery = {
    title?: Maybe<string>;
    username?: Maybe<string>;
    // For infinite pagination
    first?: string;
    after?: string;
    last?: string;
    before?: string; 
    // For general pagination
    page?: string;
    size?: string;
}
export type ArticleBody = {
    title?: Maybe<string>;
    content?: Maybe<string>;
    username?: Maybe<string>;
    passwd?: Maybe<string>;
}
export type ArticleParams = {
    id?: Maybe<string>;
}

export type ArticleEdge = {
    node: ArticleModel;
    cursor: string;
}
export type ArticleConnection = {
    totalCount: number;
    edges?: Maybe<ArticleEdge[]>;   // For infinite pagination
    data?: Maybe<ArticleModel[]>;     // For general pagination
    pageInfo: PageInfo;
}

export type QueryInput = {
    title?: Maybe<string>;
    username?: Maybe<string>;
    articleId?: Maybe<number>;
    content?: Maybe<string>;
    passwd?: Maybe<string>;
    parentId?: Maybe<number>;
}

// For Comment
export type CommentQuery = {
    title?: Maybe<string>;
    username?: Maybe<string>;
    articleId?: Maybe<string>;
    // For general pagination
    page?: string;
    size?: string;
}

export type CommentBody = {
    articleId?: Maybe<string>;
    parentId?: Maybe<string>;
    content?: Maybe<string>;
    username?: Maybe<string>;
}

export type Connection<T> = {
    totalCount: number;
    data?: Maybe<T[]>;
    pageInfo: PageInfo;
}