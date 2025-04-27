const fs = require ('fs');

function logReqRes (filename){
    return (req,res,next) => {
        const log = `\n${Date.now()} : ${req.method} : ${req.path} : ip address is ${req.ip}  and ${req.url}`;
        fs.appendFile (filename, log, (err,data)=> {
            next();
        });
    }
}

module.exports = {
    logReqRes
}