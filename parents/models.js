'use strict'
const mongoose = require('mongoose');

const ParentalInfoSchema = mongoose.Schema({
    userID: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    ageOfChild: {type: Number, required: true},
    dateNeeded: {type: Date, required: true},
    startTime: {type: String, required: true},
    endTime: {type: String, required: true},
    additionalInfo: {type: String, required: false},
})

ParentalInfoSchema.methods.apiRepr = function() {


    return {
        parentID: this._id,
        userID: this.userID,
        ageOfChild: this.ageOfChild,
        dateNeeded: this.dateNeeded,
        startTime: this.startTime,
        endTime: this.endTime,
        additionalInfo: this.additionalInfo,
    }
}


const ParentalInfo = mongoose.model('ParentalInfo', ParentalInfoSchema);

module.exports = {ParentalInfo};