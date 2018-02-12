'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { ParentalInfo } = require('./models');
const { Sitter } = require('../sitters/models');
const { User } = require('../users/models');
const router = express.Router();
const jsonParser = bodyParser.json();


router.post('/bio/create', jsonParser, (req, res) => {
    let { parentUserID, ageOfChild, dateNeeded, startTime, location, endTime, additionalInfo } = req.body
    // console.log('req.body', req.body)
    return ParentalInfo.create({ parentUserID, ageOfChild, location, dateNeeded, startTime, endTime, additionalInfo })
        .then(parent => {
            console.log('Parent', parent)
            return res.status(201).json(parent.apiRepr())
        })
        .catch(err => {
            console.log('err', err)
            res.status(500).json({message: 'Internal server error'})
        })
})



  module.exports = { router };

