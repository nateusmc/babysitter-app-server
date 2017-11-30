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
  

router.post('/', (req, res) => {
    console.log(req.body);
const requiredFields = ['firstName', 'lastName', 'ageOfChild', 'zipcode', 'dateNeeded', 'startTime','endTime', 'email']
const missingField = requiredFields.find(field => !(field in req.body));

    if(missingField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: 'Missing field',
            location: missingField
        })
    }

    // const numberFields = ['ageOfChild', 'zipcode',]
    // const nonNumberFields = numberFields.find(
    //     field => field in req.body && typeof req.body[field] !== 'number'
    // );

    // if(nonNumberFields) {
    //     return res.status(422).json({
    //         code: 422, 
    //         reason: 'ValidationError',
    //         message: 'Incorrect field type: expected number',
    //         location: nonNumberFields
    //     });
    // }

    const sizedFields = {
        zipcode: {min: 5, max: 5}
    }

    const tooSmallField = Object.keys(sizedFields).find(field =>
        'min' in sizedFields[field] && 
        req.body[field].trim().length < sizedFields[field]. min
    );

    const tooLargeField = Object.keys(sizedFields).find(field =>
        'max' in sizedFields[field] &&
        req.body[field].trim().length > sizedFields[field].max
    );

    if(tooSmallField || tooLargeField) {
        return res.status(422).json({
            code: 422,
            reason: 'ValidationError',
            message: tooSmallField
                ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
                : `Must be at most  ${sizedFields[tooLargeField].max} characters long`,
            location: tooSmallField || tooLargeField
        })
    }


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
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            email: req.body.email,
            additionalInfo: req.body.additionalInfo,
        })
        .then(parentInfo => res.status(201).json(parentInfo.apiRepr()))
        .catch(err => {
        console.error(err);
        res.status(500).json({error: 'info not received'})
        })
    });


  module.exports = { router };