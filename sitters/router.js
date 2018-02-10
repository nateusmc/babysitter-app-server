'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Sitter } = require('./models')
const { ParentalInfo } = require('../parents/models')
const { User } = require('../users/models')
const router = express.Router();
const jsonParser = bodyParser.json();
// const passport = require('passport');
// const jwt = require('jsonwebtoken');
// const jwtAuth = passport.authenticate('jwt', {session:false});


router.post('/bio/create', jsonParser, (req, res) => {
    let { sitterUserID, bio, yearsExperience, location, dateAvailable, hoursAvailable } = req.body;
    return Sitter.create({ sitterUserID, bio, yearsExperience, location, dateAvailable, hoursAvailable })
        .then(sitter => {
            return res.status(201).json(sitter.apiRepr())
        })
        .catch(err => res.status(500).json({message: 'Internal server error'}))
})


// router.get('/:zipcode', jsonParser, (req, res) => {
//     console.log(req.params.zipcode)
//     return ParentalInfo.find({
//         location: req.params.zipcode, 
//     })
//         .then(info => {
//             console.log('info', info)
//             res.json(info.map(data => data.apiRepr()))
//         })
//         .catch(err => {
//             console.error('+++++', err);
//             res.status(500).json({error: 'server side error'});
//         });
//   });

router.get('/:zipcode', jsonParser, (req, res) => {
console.log(req.params.zipcode)
return Sitter.find(
    {location: req.params.zipcode},
    {'_id': 0, 'sitterUserID': 0 }
)
    .then(data => {
        res.status(200).json(data)
    })
    .catch(err => {
        // console.error(err);
        res.status(500).json({error: 'server side error'});
    });
});
  

module.exports = {router};