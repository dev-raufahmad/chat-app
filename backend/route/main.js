const express = require("express");
const jwt = require('jsonwebtoken');
const verifier = require('../middleware/verifier.js');
const { add , remove , contain , updateOTP , validate } = require('../config/OTP.js');


const router = express.Router();

router.get("/", (req, res) => {
    res.send("Hello World");
})

router.post('/otp' , ( req , res ) => {
    console.log("Entered the function of the otp");
    console.log("THe req.body is : " , req.body);
    
    const { email , password } = req.body;
    console.log("THe email is : " , email , " and the password is : " , password);

    if(contain({ email : email })){
        return res.json({
        message : "Can't send otp",
        })
    }

    let random = 0;
    while(random.toString().length !=4){
        random = Math.random();
        console.log("The random in the while loop is : " , random);
        
        random = random*10000;
        random = random.toFixed(0);
    }
    
    

    console.log("THe otp that is generated is : " , random);
    add({ email : email } , random)
    return res.json({
        message : "okay",
        otp : random})
})

router.post('/login' , ( req , res ) => {
    const body = req.body;
    console.log("THe body of the req is : " , body);
    const res1 = contain({ email : req.body.email });
    if( !res1 ){
        return res.json({
            message : "bad"
        })
    }
    console.log("The res1 is : " , res1);
    
    if(!(res1.otp == req.body.otp)){
        remove({ email : req.body.email });
        console.log("Remove has been completed");
        
        return res.json({
            message : "bad"
        })
    }
    const accessToken = jwt.sign({
        email : body.email,
        pass : body.password
    } , "Rauf" , {
        expiresIn : "15m"
    });

    console.log("THe token that we have generated for the access token is : " , accessToken);


    const refreshToken = jwt.sign({
        email : body.email,
    } , "Rauf" , {
        expiresIn : "15d"
    });

    console.log("THe token that we have generated for the access token is : " , refreshToken);
    

    res.cookie('accessToken' , accessToken , {
        httpOnly : true,
        sameSite : 'strict',
        maxAge : 1000 * 60 * 15
    });
    res.cookie('refreshToken' , refreshToken , {
        httpOnly : true,
        sameSite : 'strict',
        maxAge : 1000 * 60 * 60 * 24 * 15
    });

    return res.json({
        message : "Successful"
    });
})

router.get('/good' , verifier , ( req , res ) => {
    console.log("The req.user in the good route is : " , req.user);
    
    return res.json({
        message : "Have a nice day from the good route"
    })
})

module.exports = router;