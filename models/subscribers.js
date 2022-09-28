const mongoose = require('mongoose')

const subscriberSchema = new mongoose.Schema({
    nums: {
        type: String,
        required: true
    },
    isHit: {
        type: Boolean,
        required: true,
        default: false
    },
    msg: {
        type: String,
        required: true
    },
    when: {
        type: Date,
        required: true
    },
    email: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Subscriber', subscriberSchema);