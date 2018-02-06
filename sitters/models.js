'use strict'
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const SitterInfoSchema = mongoose.Schema({
    sitter: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    bio: {type: String, required: true},
    yearsExperience: {type: Number, required: true},
    dateAvailable: {type: Date, required: true},
    hoursAvailable: {type: Number, required: false},
})

SitterInfoSchema.methods.apiRepr = function() {
    return {
        sitterID: this._id,
        sitter: this.sitter || '',
        bio: this.bio || '',
        yearsExperience: this.yearsExperience || '',
        dateAvailable: this.dateAvailable || '',
        hoursAvailable: this.hoursAvailable || ''
    }
}

const Sitter = mongoose.model('Sitter', SitterInfoSchema)

module.exports = {Sitter};