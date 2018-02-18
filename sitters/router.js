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
    let { id, bio, yearsExperience, location, dateAvailable, hoursAvailable, rate, sitterHeader } = req.body;
    return Sitter.create({ sitterUserID: id, bio, yearsExperience, location, dateAvailable, hoursAvailable, rate, sitterHeader })
        .then(sitter => {
            return res.status(201).json(sitter.apiRepr())
        })
        .catch(err => res.status(500).json({message: 'Internal server error'}))
})



router.get('/:zipcode', jsonParser, (req, res) => {
    return Sitter.find(
        {location: req.params.zipcode},
        {'_id': 0, '__v': 0 }
        )
        .populate('sitterUserID', {'_id': 0, '__v': 0, 'password': 0})
        .then(data => {
                res.status(200).json(data)
            })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'server side error'});
            });
});
  

module.exports = {router};