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
    return ParentalInfo.create({ parentUserID: id, ageOfChild, location, dateNeeded, startTime, endTime, additionalInfo })
        .then(values => {
            console.log('Parent', values)
            return res.status(201).json(values.apiRepr())
        })
        .catch(err => {
            console.log('err', err)
            res.status(500).json({message: 'Internal server error'})
        })
})

router.get('/:zipcode', jsonParser, (req, res) => {
	return ParentalInfo.find(
		{location: req.params.zipcode},
		{'_id':0, '__v':0}
	)
		.populate('parentUserID', {'_id': 0, '__v': 0, 'password': 0})
		.then(data => res.status(200).json(data))
		.catch(err => res.status(500).json({error: 'server side error'}))
})


  module.exports = { router };

