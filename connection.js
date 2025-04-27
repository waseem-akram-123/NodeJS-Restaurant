const mongoose = require ("mongoose");

async function connectToMongoDb (mongoURL){
    return mongoose.connect (mongoURL);
}

module.exports= {
    connectToMongoDb,
}