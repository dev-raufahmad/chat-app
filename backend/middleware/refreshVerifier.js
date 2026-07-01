const jwt = require('jsonwebtoken');

const refreshVerifier = ( req , res , next ) => {
    const refreshToken = req.cookies.refreshToken;
    console.log("The refresh token in the refresh verifier is : " , refreshToken);
    if(!refreshToken){
        return res.status(401).json({
            message : "You did'nt have the valid refresh token"
        })
    }
    const data = jwt.verify( { email : refreshToken.email , password : "Ahmad" } , "Rauf" )
    req.user = data;
    next();
}


module.exports = refreshVerifier;