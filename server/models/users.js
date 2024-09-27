const mongoose = require("mongoose")

const {Schema, model} = mongoose 

const userSchema = new Schema({
    username:{
        type: String,
        required: [true, 'Email address is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
        validator: function(v) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
    },
    },
    password:{
        type:String,
        required: true
    },
});

const UserModel = mongoose.model("User", userSchema);

module.exports= UserModel;




