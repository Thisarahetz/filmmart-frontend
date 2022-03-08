const jwt = require('jsonwebtoken');

function verify(req, res, next) {
    const authHeder = req.headers.token;
    //console.log(authHeder)
    if(authHeder){
        const token = authHeder.split(' ')[1];

    // verify a token symmetric
    jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
    //console.log(decoded) // bar
    if(err) res.status(403).json("Token is not valid");
    req.user = decoded;
    next();
  });
    }else{
        return res.status(403).json("You are not authontication");

    }
}

module.exports = verify;