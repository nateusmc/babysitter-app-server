'use strict'
const mongoose = require('mongoose');

const ParentalInfoSchema = mongoose.Schema({
    parentUserID: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    location: {type: Number, required: true},
    ageOfChild: {type: String, required: true},
    dateNeeded: {type: Date, required: true},
    startTime: {type: String, required: true},
    endTime: {type: String, required: true},
    additionalInfo: {type: String, required: false},
})

ParentalInfoSchema.methods.apiRepr = function() {


    return {
        parentSchemaID: this._id || '',
        parentUserID: this.parentUserID || '',
        location: this.location || '',
        ageOfChild: this.ageOfChild || '',
        dateNeeded: this.dateNeeded || '',
        startTime: this.startTime || '',
        endTime: this.endTime || '',
        additionalInfo: this.additionalInfo || '',
    }
}


const ParentalInfo = mongoose.model('ParentalInfo', ParentalInfoSchema);

module.exports = { ParentalInfo };