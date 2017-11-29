'use strict'

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
 
mongoose.Promise = global.Promise;

const { router: parentsRouter } = require('./users');
const {PORT, DATABASE_URL, CLIENT_ORIGIN} = require('./config');
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
    origin: CLIENT_ORIGIN
  })
);  
// console.log(parentsRouter);
app.use('/api/parents/', parentsRouter);

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
    console.log(DATABASE_URL)
      return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
          if (err) {
            return reject(err);
          }
          const server = app.listen(port, () => {
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