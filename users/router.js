'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const { ParentalInfo } = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();


router.post('/zipcode', jsonParser, (req, res) => {
    console.log(req.body.zipcode)
    return ParentalInfo
        .find()
        .where('zipcode').equals(req.body.zipcode)
        .then(info => {
            console.log(info)
            res.json(info.map(data => data.apiRepr()))
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'server side error'});
        });
  });

// router.get('?zipcode', (req, res) => {
//     return ParentalInfo
//     .find()
//     .where('zipcode').equals(req.query.zipcode)
//     .then(result => {
//         res.json(result);
//     })
// })
  

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