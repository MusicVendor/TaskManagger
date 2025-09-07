const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const taskSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: { 
    type: String, 
    enum: ['to-do', 'in-progress', 'completed'], 
    default: 'to-do'
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    dueDate: {
        type: Date
    }
})

module.exports = mongoose.model('Task', taskSchema);