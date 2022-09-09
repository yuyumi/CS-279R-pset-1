const mongoose = require('mongoose');

// Create a Mongoose Schema (format for the to-do item input)
const todoTaskSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    star: {
        type: Boolean,
        default: false
    }
})

// Export to a model
module.exports = mongoose.model('TodoTask',todoTaskSchema);