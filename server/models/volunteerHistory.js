const mongoose = require("mongoose")

const {Schema, model} = mongoose 


const volunteerHistorySchema = new Schema({
    volunteer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Accepted', 'Declined', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    assignedAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    }
});


const VolunteerHistoryModel = mongoose.model("VolunteerHistory", volunteerHistorySchema);

module.exports= VolunteerHistoryModel;
