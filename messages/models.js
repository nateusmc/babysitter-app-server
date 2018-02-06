'use strict'
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const MessageSchema = mongoose.Schema({
    parentID: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    sitterID: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    messages: [{type: String, required: false}],
    dateTime: {type: Date, required: true, default: Date.now}
})

MessageSchema.methods.apiRepr = function () {
    return {
        messageID: this._id,
        sitterID: this.studentID || '',
        parentID: this.parentID || '',
        messages: this.messages || '',
        dateTime: this.dateTime || ''
    }
}

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema)

module.exports = { Message } ;