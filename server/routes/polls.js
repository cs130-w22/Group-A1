const express = require('express')
const router = express.Router();
const mongoose = require('mongoose'); 
const PollOption = require('../models/pollOption')
const Poll = require('../models/poll')


router.get('/', function(req, res, next) {
    mongoose.connect(process.env.DB_URI, { useNewUrlParser: true , useUnifiedTopology: true})
            .then(() => {
                let findAllPollsQuery = Poll.find()
                findAllPollsQuery.exec().then((polls) => {
                    res.status(200)
                    if (polls.length == 0) {
                        res.send("No polls found")
                    }
                    else {
                        res.json(polls)
                    }
                })
            })
            .catch((err) => console.log(err));

}) 

router.post('/create', function(req, res, next) {
    mongoose.connect(process.env.DB_URI, { useNewUrlParser: true , useUnifiedTopology: true})
            .then(() => {
                Poll.create(req.body).then((newPoll) => {
                    res.status(200)
                    res.json(newPoll)
                })
            })
            .catch((err) => console.log(err));
})
/*
router.post('/', function(req, res, next) { //save once created


        mongoose.Promise = Promise;
        mongoose.connect(process.env.DB_URI, { useNewUrlParser: true , useUnifiedTopology: true})
            .then(() => Poll.find({_id: curr_id}).exec()
                .then((pollFound) => {
                    res.status(200)
                    res.send("Poll ")
                })
                if (err) {
                    res.status()
                    res.json({messsage:'error'})
                }
                else {

                    res.status(200)
                }
                res.send("Poll Added Successfully")
            }))
            .catch((err) => res.send("Could Not Add Poll"));


    
})
*/

router.post('/addoption', function(req, res, next) {
        mongoose.connect(process.env.DB_URI, { useNewUrlParser: true , useUnifiedTopology: true})
            .then(() => {
                if (req.body.optionID != "") {
                    PollOption.findOne({_id: req.body.optionID}).exec()
                    .then((pollOption) => {
                        if (pollOption) {
                            pollOption.text = req.body.text
                            pollOption.votes = req.body.votes
                            pollOption.voters = req.body.voters
                            pollOption.save().then(() => {
                                res.status(200)
                                res.json(pollOption)
                            })
                            .catch((err) => {
                                res.status(404)
                                res.send("unable to update option")
                            })
                        }
                    }).catch((err) => res.send("could not find option"))
                }
                else {
                        //let poll = new Array(mongoose.Types.ObjectId(req.body.pollID))
                        PollOption.create({poll: req.body.pollID, text: req.body.text, votes: req.body.votes, voters: req.body.voters}).then((newOption) => {
                                res.status(200)
                                res.json(newOption)
                            }).catch((err) => res.send("could not create option"))
                }
            }).catch((err) => console.log(err));
                
    
})


router.get('/getoptions', function(req, res, next) {
    mongoose.connect(process.env.DB_URI, { useNewUrlParser: true , useUnifiedTopology: true})
        .then(() => {
        PollOption.find({poll: mongoose.Types.ObjectId(req.query.pollID)}).exec().then((pollOptions) => {
            res.status(200)
           if (pollOptions.length == 0) {
                console.log("none") 
           }
           else {
                res.status(200)
                res.json(pollOptions)
           }
            
        }).catch((err) => {console.log(err)})
    })
})

router.post('/geteveryoption', function(req, res, next) {
    
    try {
    
        const findAllQuery = PollOption.find()
        findAllQuery.exec().then((pollOptions) => {
            res.status(200)
           if (pollOptions.length == 0) {
                console.log("none") 
           }
           else {
                res.status(200)
                res.json(pollOptions)
           }
            
        })
    }
    catch (error) {
        res.json({message: "Error: ", error})
    }
})

router.delete('/deletethisoption', (req, res, next) => {
  PollOption.findOneAndDelete({_id: req.body.optionID}).then((deleted) => res.json(deleted))
    .catch((err) => console.log(err))  
})

router.delete('/deletealloptions', (req, res, next) => {
    PollOption.deleteMany().then(()=> res.send("All options deleted"))
        .catch((error) => res.status(404))
})

router.delete('/deletepolls', (req, res, next) => {
    Poll.deleteMany().then(()=> res.send("All polls deleted"))
        .catch((error) => res.status(404))
})

  module.exports = router;