const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
 
mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {ParentalInfo} = require('./users/models');

const app = express();

app.use(bodyParser.json());

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: DATABASE_URL
  })
);  

app.get('/', (req, res) => {
  console.log('server.js working')
  res.send('stop running')
})

app.get('/parents', (req, res) => {
  ParentalInfo
    .find()
  res.send('/parents works')
})

app.post('/parents', (req, res) => {
  const requiredFields = ['firstName', 'lastName', 'ageOfChild', 'zipCode', 'dateNeeded']
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
      zipCode: req.body.zipCode,
      dateNeeded: req.body.dateNeeded
    })
    .then(parentInfo => res.status(201).json(parentInfo.apiRepr()))
    .catch(err => {
      console.error(err);
      res.status(500).json({error: 'info not received'})
    })
});


function runServer(databaseUrl=DATABASE_URL, port=PORT) {
    
      return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
          if (err) {
            return reject(err);
          }
          server = app.listen(port, () => {
            console.log(`Your app is listening on port ${port}`);
            resolve();
          })
          .on('error', err => {
            mongoose.disconnect();
            reject(err);
          });
        });
      });
    }
    

    function closeServer() {
        return mongoose.disconnect().then(() => {
           return new Promise((resolve, reject) => {
             console.log('Closing server');
             server.close(err => {
                 if (err) {
                     return reject(err);
                 }
                 resolve();
             });
           });
        });
      }

      if (require.main === module) {
        runServer().catch(err => console.error(err));
      };
      
      module.exports = {app, runServer, closeServer};