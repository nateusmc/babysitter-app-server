'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Sitter } = require('./models')
const router = express.Router();
const jsonParser = bodyParser.json();
// const passport = require('passport');
// const jwt = require('jsonwebtoken');
// const jwtAuth = passport.authenticate('jwt', {session:false});


router.post('/bio/create', jsonParser, (req, res) => {
    let { id, bio, yearsExperience, dateAvailable, hoursAvailable } = req.body;
    return Sitter.create({ sitter: id, bio, yearsExperience, dateAvailable, hoursAvailable })
        .then(sitter => {
            return res.status(201).json(sitter.apiRepr())
        })
        .catch(err => res.status(500).json({message: 'Internal server error'}))
})


module.exports = {router};