import { DbCfg, ServerCfg } from "../type"

export const serverCfg:ServerCfg = {
    port: 8081,
    host: 'http://localhost'
}

export const dbCfg:DbCfg = {
    host: (process.env.RDS_MAIN_HOST || 'localhost'),
    port: parseInt((process.env.RDS_MAIN_PORT || '3306')),
    username: (process.env.RDS_MAIN_USER || 'root'),
    password: (process.env.RDS_MAIN_PASS || 'tjwndtn7053'),
    database: (process.env.RDS_MAIN_DATABASE || 'notice'),
}