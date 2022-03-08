const router = require('express').Router();
const User = require('../models/User');
const verify = require('../verifyToken');

/*hash algorithms*/
const CryptoJS = require("crypto-js");
/*
*@UPDATE
*/
router.put("/:id",verify, async(req,res)=>{
    if(req.user.id === req.params.id || req.user.isAdmin){
        //console.log(req)
        if(req.body.password) {
            req.body.password = CryptoJS.AES.encrypt(
              req.body.password,
              process.env.SECRET_KEY
             ).toString();
            }
            try{
                const updateUser = await User.findByIdAndUpdate(
                   req.params.id,
                   {
                       $set: req.body,
                   },
                   {new:true}     
                );
                res.status(200).json(updateUser);
            }catch(err){
                res.status(500).json(err);
            }
    }else{
        res.status(403).json("You can update only your account")
    }

});

module.exports = router