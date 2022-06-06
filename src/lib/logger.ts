
/*******************************************
 * TODO : It depends on the platform. 
 * If the server would be run on AWS Lambda like, it can juse use console because CloudWatch can support it.
 ********************************************/
const log = {
    info: console.log,
    error: console.error
}
export { log }
