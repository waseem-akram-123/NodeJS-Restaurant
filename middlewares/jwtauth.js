// const { validateToken } = require("../service/auth");

// function checkAuthentication(req, res, next) {
//     const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

//     if (!token) {
//         return res.status(401).json({ error: "Authentication token missing" });
//     }

//     try {
//         const decoded = validateToken(token);
//         req.user = decoded; // attach user info to req
//         console.log (req.user);
//         next();
//     } catch (err) {
//         return res.status(401).json({ error: "Invalid or expired token" });
//     }
// }

// module.exports = {
//     checkAuthentication
// }
// middlewares/jwtauth.js      --- similar to blogging page where signup and sign doesn't require token ----- but we have to check manually if (!req.user) is there in every route
const { validateToken } = require("../service/auth");

function checkAuthentication(req, res, next) {
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return next(); // No token? Just move on

    try {
        const decoded = validateToken(token);
        req.user = decoded; // Attach user info to the request
    } catch (err) {
        console.log("Invalid token", err.message);
    }

    next(); // Always call next
}


module.exports = {
    checkAuthentication
};
