const mongoose = require("mongoose")

const {Schema, model} = mongoose 

const userProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true,
        maxLength: 50
    },
    address1: {
        type: String,
        required: true,
        maxLength: 100
    },
    address2: {
        type: String,
        maxLength: 100
    },
    city: {
        type: String,
        required: true,
        maxLength: 100
    },
    state: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 2,
        uppercase: true
    },
    zipCode: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{5}(-\d{4})?$/.test(v);
            },
            message: props => `${props.value} is not a valid zip code!`
        }
    },
    skills: [{
        type: String,
        required: true
    }],
    preferences: {
        type: String
    },
    availability: [{
        type: Date,
        required: true
    }]
});

const UserProfileModel = mongoose.model("UserProfile", userProfileSchema);

module.exports= UserProfileModel;