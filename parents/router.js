'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { ParentalInfo } = require('./models');
const { Sitter } = require('../sitters/models');
const { User } = require('../users/models');
const router = express.Router();
const jsonParser = bodyParser.json();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtAuth = passport.authenticate('jwt', { session: false });

router.post('/bio/create', jsonParser, (req, res) => {
	let { id, ageOfChild, dateNeeded, startTime, location, endTime, additionalInfo, numberOfChildren } = req.body;
	return ParentalInfo.create({
		parentUserID: id,
		ageOfChild,
		location,
		dateNeeded,
		startTime,
		endTime,
		additionalInfo,
		numberOfChildren,
	})
		.then(values => {
			return res.status(201).json(values.apiRepr());
		})
		.catch(err => {
			res.status(500).json({ message: 'Internal server error' });
		});
});

router.get('/:zipcode', jsonParser, (req, res) => {
	return ParentalInfo.find({ location: req.params.zipcode }, { _id: 0, __v: 0 })
		.populate('parentUserID', { _id: 0, __v: 0, password: 0 })
		.then(data => {
			res.status(200).json(data);
		})
		.catch(err => res.status(500).json({ error: 'server side error' }));
});

router.get('/bio/:id', jsonParser, (req, res) => {
	return ParentalInfo.find({ parentUserID: req.params.id })
		.populate('parentUserID')
		.then(data => {
			res.json(data);
		})
		.catch(err => {
			res.status(500).json({ error: 'server side error' });
		});
});

module.exports = { router };
