const jwt = require ("jsonwebtoken");
const secret = "waseem@123";

function createTokenUser (person){
    const payload = {
        _id: person._id,
        username: person.username,
        email: person.email
    }
    const token = jwt.sign (payload,secret);
    return token;
}

function validateToken (token){
    const payload = jwt.verify (token,secret);
    return payload;
}

module.exports = {
    createTokenUser,
    validateToken
}