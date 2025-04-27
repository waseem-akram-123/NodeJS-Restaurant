const passport = require ("passport");
const localstratergy = require ("passport-local").Strategy;

const Person = require("../models/person");

passport.use (new localstratergy (async (username, password, done)=> {
    try{
        const user = await Person.findOne ({username});

        if(!user){
            return done (null, false, {message:"incorrect username"});
        }
        const isPasswordmatch = await user.comparepassword (password);

        if (isPasswordmatch){
            return done (null,user);
        }
        else{
            return done (null, false, {message:"incorrect password"});
        }
    }
    catch(error){
        return done(error);
    }
}));

module.exports = passport;