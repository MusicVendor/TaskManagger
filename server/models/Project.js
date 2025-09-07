const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const projectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    owner: {
        type:Schema.Types.ObjectId,
        ref: 'User',
        required: true
        //defualt value user itself
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        //default value user iteself --TO ADD--
    }],
    // tasks: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Task'
    // }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Project', projectSchema);