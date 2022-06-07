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
