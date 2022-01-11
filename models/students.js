const mongoose = require('mongoose');
const studentSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: true,
    },
    email: {
        type: 'string',
        required: true,
    },
    phone: {
        type: 'string',
        required: true,
    },
    photo: {
        type: 'string',
        required: true,
    },
    degree: {
        type: 'string',
        required: true,
    },
    created: {
        type: 'date',
        required: true,
        default: Date.now(),
    }
});

module.exports = mongoose.model('Student', studentSchema);