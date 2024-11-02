const mongoose = require("mongoose")

const {Schema, model} = mongoose 

const volunteerEventSchema = new Schema({
    eventName: {
        type: String,
        required: true,
        maxLength: 100
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    requiredSkills: [{
        type: String,
        required: true
    }],
    urgency: {
        type: String,
        required: true,
        enum: ['Low', 'Medium', 'High', 'Critical']
    },
    eventDate: {
        type: Date,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const volunteerEventModel = mongoose.model("VolunteerEvent", volunteerEventSchema);

module.exports= volunteerEventModel;
