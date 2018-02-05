'use strict'
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const SitterInfoSchema = mongoose.Schema({
    userID: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    bio: {type: String, required: true},
    yearsExperience: {type: Number, required: true},
    dateAvailable: {type: Date, required: true},
    hoursAvailable: {type: Number, required: false},
})

SitterInfoSchema.methods.apiRepr = function() {
    return {
        sitterID: this._id,
        userID: this.userID || '',
        bio: this.bio || '',
        yearsExperience: this.yearsExperience || '',
        dateAvailable: this.dateAvailable || '',
        hoursAvailable: this.hoursAvailable || ''
    }
}

const SitterInfo = mongoose.model('SitterInfo', SitterInfoSchema)

module.exports = {SitterInfo};