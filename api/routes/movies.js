const router = require('express').Router();
const Movie = require('../models/Movies');
const verify = require('../verifyToken');

/*
*@CREATE 
*/
router.post("/",verify, async(req,res)=>{
    if( req.user.isAdmin){
        const newMovies =new Movie(req.body);
            try{
                const saveUser = await newMovies.save();
                res.status(200).json(saveUser);
            }catch(err){
                res.status(500).json(err);
            }
    }else{
        res.status(403).json("You are not allowed!");
    }
});
/*
*@UPDATE
*/
router.put("/:id",verify, async(req,res)=>{
    if(req.user.isAdmin){
            try{
                const updateMovies = await Movie.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set:req.body,
                    },
                    { new:true }
                );
                res.status(201).json(updateMovies);
            }catch(err){
                res.status(500).json(err);
            }
    }else{
        res.status(403).json("You are not allowed")
    }

});

/*
*@DELETE
*/
router.delete("/:id",verify, async(req,res)=>{
    if(req.user.isAdmin){
            try{
                const movies = await Movie.findByIdAndDelete(req.params.id);
                if(movies){
                    res.status(201).json("Delete Movies!!");
                }
                res.status(201).json("movie is not found");
            }catch(err){
                res.status(500).json(err);
            }
    }else{
        res.status(403).json("You are not allowed")
    }

});

/*
*@Find Movies
*/
router.get("/find/:id", async(req,res)=>{
            try{
                const getMovies =await Movie.findById(
                    req.params.id
                );
                res.status(201).json(getMovies);
            }catch(err){
                res.status(500).json(err);
            }

});

/*
*@GET Movies
*/
router.get("/rendam",verify, async(req,res)=>{
    const queryType = req.query.type;
    let movies;
    try{
        if(queryType === "series"){
            movies = await Movie.aggregate([
                { $match : {isSeries : true}},
                { $sample : {size:1}}
            ])
        }else {
            movies = await Movie.aggregate([
                { $match : {isSeries : false}},
                { $sample : {size:1}}
            ])
        }
        res.status(200).json(movies)
    }catch(err){
        res.status(500).json(err);
    }

});

/*
*@Find Movies
*/
router.get("/", async(req,res)=>{
    try{
        const getMovies =await Movie.find();
        res.status(201).json(getMovies.reverse());
    }catch(err){
        res.status(500).json(err);
    }
});

module.exports = router