'use strict'

require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const {PORT, DATABASE_URL, CLIENT_ORIGIN} = require('./config');
const { router: parentsRouter } = require('./parents');
const { router: usersRouter } = require('./users');
const { router: sittersRouter } = require('./sitters');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const {ParentalInfo} = require('./parents/models');
const {User} = require('./users/models');
const passport = require('passport')
const app = express();
const cors = require('cors');
app.use(bodyParser.json());

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);  


app.use('/api/parents/', parentsRouter);
app.use('/api/users/', usersRouter);
app.use('/api/sitters/', sittersRouter);

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