'use strict'
const mongoose = require('mongoose');

const ParentalInfoSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    ageOfChild: {type: Number, required: true},
    zipcode: {type: Number, required: true},
    dateNeeded: {type: Date, required: true},
    additionalInfo: {type: String, required: false}
})

ParentalInfoSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        name: this.firstName + ' ' + this.lastName,
        firstName: this.firstName,
        lastName: this.lastName,
        ageOfChild: this.ageOfChild,
        zipcode: this.zipcode,
        dateNeeded: this.dateNeeded,
        additionalInfo: this.additionalInfo
    }
}


const ParentalInfo = mongoose.model('ParentalInfo', ParentalInfoSchema);

module.exports = {ParentalInfo};