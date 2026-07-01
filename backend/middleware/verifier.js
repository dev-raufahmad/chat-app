const jwt = require('jsonwebtoken');
const refreshVerifier = require('./refreshVerifier.js')

const verifier = (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;

        if (accessToken) {
            const data = jwt.verify(accessToken, "Rauf");

            req.user = data;
            next();
        }

        if (!accessToken) {
            refreshVerifier(req, res, next);
            console.log("The data in after the checking of the refrshtoken function is : " , req.user);
            
            const token = jwt.sign(req.user , "Rauf");
            req.cookie('accessToken' , token);
            console.log("Token wast available not now provided");
            
        }

        
        console.log("Here is the end of the verifier");

        next();
    } catch (error) {
        console.log("There is error in validating the access token");
        return res.json({
            message: "You are not authorized to access this route at your token was't correct"
        })
    }
}


module.exports = verifier;