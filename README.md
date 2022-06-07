# Notice Board
================


## CAUTION

> This is the example and equivalent to self developing study.
> 
> Therefore, there is no managing connection pool and instance pool of DB.
> 
> Also, would not use validator, would not use decorators, would not use defined statuCode, would not include strict unit/e2e test.
> 
> Which means this project is not robust application!!

# Prerequisite

Belows should be installed on your system before running this code of server.
* Node.js version 12.22.x or more latest version
* npm version 6.14.x or more latest version
* MySQL server 8.x or more latest version

**The version is just refereance I have tested.**

# Installing
### Package installing
```bash
npm install
```
### Create DB Tables
You can find db table schema file form ./schema folder.

You can run below command your terminal or workbranch command line interface after the connection was established.
```
source {root of source code}/script/dbschema.sql
```

## Setting Environment
If you run this code for server, you should set the environment of server, DB connection information on your evn or code directly.

You could see values to ./src/config/index.ts file (Currently, all env values are empty or default)

### Server Information
* Set host URI and Port number that you would use to const value of "serverCfg".
```javascript
export const serverCfg:ServerCfg = {
    port: 8080,
    host: 'http://localhost'
}
```
### DB Information
* Set Your DB connection information that you would use to  const value of "dbCfg"
```javascript
export const dbCfg:DbCfg = {
    host: (process.env.RDS_MAIN_HOST || 'localhost'),
    port: parseInt((process.env.RDS_MAIN_PORT || '3306')),
    username: (process.env.RDS_MAIN_USER || ''),
    password: (process.env.RDS_MAIN_PASS || ''),
    database: (process.env.RDS_MAIN_DATABASE || 'notice'),
}
```

# Run Commands
There are serveral commands such as start server, dev, test, build, you should choice and run what you want to do.

## Start Server (Dev mode)
```
npm run compile  (It can be emitted, if you have done befre)
npm run dev
```

## Start Server (Prod mod)
```
npm run build
npm run start
```

## Unit Test
```
npm test
```

## Etc
```
npm run bundle -> Build a single file source code to /dist/app.js
```

# API Test
## Postman test
[API Test Link](https://documenter.getpostman.com/view/7756251/Uz5JHb85#21c5a2bc-4b6d-40ab-82ce-a02caed9b103)

## Basic Response Format
**JSON Format would be return.**


### Article Response
```json
{
    "success": Boolean,
    "data": [{
        "id": number,
        "title": string,
        "content": string,
        "username": string,
        "passwd": string,
        "createdAt": string,
        "updatedAt": string
    }]
    "pageInfo":{
        "pageSize": number
        "currentPage": number,
        "lastPage": number
    }
}
```
### Example of Article Response
```json
{
    "success": true,
    "data": {
        "totalCount": 2,
        "data": [
            {
                "id": 25,
                "title": "coco4",
                "content": "coco4",
                "username": "pokers3",
                "passwd": "5b4a5967fa3ce6beff29d7fc2a61aa077f2884ade8178b7db6995b205722a796",
                "createdAt": "2022-06-06T09:28:45.000Z",
                "updatedAt": "2022-06-06T09:28:45.000Z"
            },
            {
                "id": 24,
                "title": "coco4",
                "content": "coco4",
                "username": "pokers3",
                "passwd": "5b4a5967fa3ce6beff29d7fc2a61aa077f2884ade8178b7db6995b205722a796",
                "createdAt": "2022-06-05T09:26:40.000Z",
                "updatedAt": "2022-06-05T09:26:40.000Z"
            },
        ],
        "pageInfo": {
            "pageSize": 2,
            "currentPage": 1,
            "lastPage": 3
        }
    }
}
```

### Comment Response
```json
{
    "success": Boolean,
    "data": [{
        "id": number,
        "articleId": number,
        "parentId": number,
        "content": string,
        "username": string,
        "createdAt": string,
        "child": Array
    }]
    "pageInfo":{
        "pageSize": number
        "currentPage": number,
        "lastPage": number
    }
}
```
### Examle of Comment Response
```json
{
    "success": true,
    "data": {
        "totalCount": 16,
        "data": [
            {
                "id": 17,
                "articleId": 13,
                "parentId": 16,
                "content": "content",
                "username": "username",
                "createdAt": "2022-06-07T04:05:07.000Z",
                "child": []
            },
            {
                "id": 16,
                "articleId": 13,
                "parentId": null,
                "content": "content",
                "username": "username",
                "createdAt": "2022-06-07T04:04:59.000Z",
                "child": [
                    {
                        "id": 17,
                        "articleId": 13,
                        "parentId": 16,
                        "content": "content",
                        "username": "username",
                        "createdAt": "2022-06-07T04:05:07.000Z"
                    }
                ]
            },
            {
                "id": 9,
                "articleId": 12,
                "parentId": null,
                "content": "insert comment 1",
                "username": "pokers11",
                "createdAt": "2022-06-05T06:33:44.000Z",
                "child": [
                    {
                        "id": 10,
                        "articleId": 12,
                        "parentId": 9,
                        "content": "insert comment 1-1",
                        "username": "pokers12",
                        "createdAt": "2022-06-05T06:34:15.000Z"
                    },
                    {
                        "id": 12,
                        "articleId": 13,
                        "parentId": 9,
                        "content": "insert comment 13-1 coco",
                        "username": "pokers12",
                        "createdAt": "2022-06-05T09:27:23.000Z"
                    }
                ]
            },
        ],
        "pageInfo": {
            "pageSize": 50,
            "currentPage": 1,
            "lastPage": 1
        }
    }
}
```
