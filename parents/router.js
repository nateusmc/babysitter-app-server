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


// for landingPage. No auth needed

// router.get('/:zipcode', jsonParser, (req, res) => {
//     console.log(req.params.zipcode)
//     return Sitter.find(
//         {location: req.params.zipcode},
//         {'_id': 0, 'sitterUserID': 0 }
//     )
//         .then(data => {
//             res.status(200).json(data)
//         })
//         .catch(err => {
//             // console.error(err);
//             res.status(500).json({error: 'server side error'});
//         });
//   });
  

  module.exports = { router };


// router.post('/zipcode', jsonParser, (req, res) => {
//     console.log(req.body.zipcode)
//     return ParentalInfo
//         .find()
//         .where('zipcode').equals(req.body.zipcode)
//         .then(info => {
//             console.log(info)
//             res.json(info.map(data => data.apiRepr()))
//         })
//         .catch(err => {
//             console.error(err);
//             res.status(500).json({error: 'server side error'});
//         });
//   });
  

// router.post('/', (req, res) => {
//     console.log(req.body);
// const requiredFields = ['firstName', 'lastName', 'ageOfChild', 'zipcode', 'dateNeeded', 'startTime','endTime', 'email']
// const missingField = requiredFields.find(field => !(field in req.body));

//     if(missingField) {
//         return res.status(422).json({
//             code: 422,
//             reason: 'ValidationError',
//             message: 'Missing field',
//             location: missingField
//         })
//     }

//     const sizedFields = {
//         zipcode: {min: 5, max: 5}
//     }

//     const tooSmallField = Object.keys(sizedFields).find(field =>
//         'min' in sizedFields[field] && 
//         req.body[field].trim().length < sizedFields[field]. min
//     );

//     const tooLargeField = Object.keys(sizedFields).find(field =>
//         'max' in sizedFields[field] &&
//         req.body[field].trim().length > sizedFields[field].max
//     );


//     for(let i=0; i<requiredFields.length; i++) {
//         const field = requiredFields[i];
//         if(!(field in req.body)) {
//         const message = `Missing \`${field}\` in request body`
//         console.error(message)
//         return res.status(400).send(message);
//         }
//     }

//     ParentalInfo
//         .create({
//             firstName: req.body.firstName,
//             lastName: req.body.lastName,
//             ageOfChild: req.body.ageOfChild,
//             zipcode: req.body.zipcode,
//             dateNeeded: req.body.dateNeeded,
//             startTime: req.body.startTime,
//             endTime: req.body.endTime,
//             email: req.body.email,
//             additionalInfo: req.body.additionalInfo,
//         })
//         .then(parentInfo => res.status(201).json(parentInfo.apiRepr()))
//         .catch(err => {
//         console.error(err);
//         res.status(500).json({error: 'info not received'})
//         })
//     });