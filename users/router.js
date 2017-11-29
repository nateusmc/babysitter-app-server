'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const { ParentalInfo } = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();


router.get('/', (req, res) => {
    ParentalInfo
        .find()
        .then(info => {
            return res.send(info)
        })
  })
  

router.post('/', (req, res) => {
const requiredFields = ['firstName', 'lastName', 'ageOfChild', 'zipcode', 'dateNeeded']
for(let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if(!(field in req.body)) {
    const message = `Missing \`${field}\` in request body`
    console.error(message)
    return res.status(400).send(message);
    }
}

ParentalInfo
    .create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    ageOfChild: req.body.ageOfChild,
    zipcode: req.body.zipcode,
    dateNeeded: req.body.dateNeeded,
    additionalInfo: req.body.additionalInfo,
    })
    .then(parentInfo => res.status(201).json(parentInfo.apiRepr()))
    .catch(err => {
    console.error(err);
    res.status(500).json({error: 'info not received'})
    })
});


  module.exports = { router };