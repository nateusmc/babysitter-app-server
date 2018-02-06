'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { User } = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json()


// Post to register a new user
router.post('/', jsonParser, (req, res) => {
const requiredFields = ['firstName', 'lastName', 'zipcode', 'email', 'password'];
const missingField = requiredFields.find(field => !(field in req.body));
if (missingField) {
    return res.status(422).json({
    code: 422,
    reason: 'ValidationError',
    message: 'Missing field',
    location: missingField
    });
}

const stringFields = ['password', 'firstName', 'lastName', 'email'];
const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
);
if (nonStringField) {
    return res.status(422).json({
    code: 422,
    reason: 'ValidationError',
    message: 'Incorrect field type: expected string',
    location: nonStringField
    });
}

// If the password isn't trimmed we give an error.  Users might
// expect that these will work without trimming (i.e. they want the password
// "foobar ", including the space at the end).  We need to reject such values
// explicitly so the users know what's happening, rather than silently
// trimming them and expecting the user to understand.
// We'll silently trim the other fields, because they aren't credentials used
// to log in, so it's less of a problem.
const explicityTrimmedFields = ['password', 'email'];
const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
);
if (nonTrimmedField) {
    return res.status(422).json({
    code: 422,
    reason: 'ValidationError',
    message: 'Cannot start or end with whitespace',
    location: nonTrimmedField
    });
}
const sizedFields = {
    password: {
    min: 6,
    // bcrypt truncates after 72 characters, so let's not give the illusion
    // of security by storing extra (unused) info
    max: 72
    }
};
const tooSmallField = Object.keys(sizedFields).find(
    field =>
    'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
);
const tooLargeField = Object.keys(sizedFields).find(
    field =>
    'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
);
if (tooSmallField || tooLargeField) {
    return res.status(422).json({
    code: 422,
    reason: 'ValidationError',
    message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
        .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
        .max} characters long`,
    location: tooSmallField || tooLargeField
    });
}
let {password, firstName = '', lastName = '', role, email = '', zipcode = ''} = req.body;
// password comes in pre-trimmed, otherwise we throw an error
// before this
firstName = firstName.trim();
lastName = lastName.trim();
email = email.trim();
zipcode = zipcode.trim();

return User.find({email})
    .count()
    .then(count => {
    if (count > 0) {
        // There is an existing user with the same email
        return Promise.reject({
        code: 422,
        reason: 'ValidationError',
        message: 'This e-mail is already a registered user',
        location: 'email'
        });
    }
    // If there is no existing user, hash the password
    return User.hashPassword(password);
    })
    .then(hash => {
    return User.create({
        email,
        zipcode,
        password: hash,
        firstName,
        lastName,
        role
    });
    })
    .then(user => {
    return res.status(201).json(user.apiRepr());
    })
    .catch(err => {
    
    // Forward validation errors on to the client, otherwise give a 500
    // error because something unexpected has happened
    if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
    }
    console.error(err)
    res.status(500).json({code: 500, message: 'Internal server error'});
    });
});


//used for initial testing purposes
router.get('/', (req, res) => {
return User.find()
    .then(users => res.json(users.map(user => user.apiRepr())))
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});



module.exports = {router};