'use strict'
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const SitterInfoSchema = mongoose.Schema({
    sitterUserID: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    sitterHeader: {type: String, required: false},
    bio: {type: String, required: true},
    location: {type: Number, required: true},
    yearsExperience: {type: Number, required: true},
    dateAvailable: {type: Date, required: true},
    hoursAvailable: {type: Number, required: false},
    rate: {type: Number, required: true},
})

SitterInfoSchema.methods.apiRepr = function() {
    return {
        sitterID: this._id,
        sitterUserID: this.sitterUserID || '',
        bio: this.bio || '',
        location: this.location || '',
        yearsExperience: this.yearsExperience || '',
        dateAvailable: this.dateAvailable || '',
        hoursAvailable: this.hoursAvailable || ''
    }
}

const Sitter = mongoose.model('Sitter', SitterInfoSchema)

module.exports = {Sitter};