const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const {mongoose} = require('mongoose');
const cookieParser = require("cookie-parser")

//database connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Database Connected"))
    .catch((error) => console.log("DB not connected", error))
    //everytime you make changes to the env file, make sure to reset the server

    
const app = express();
//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))


app.use('/', require('./routes/authRoutes'))

const port = 8000;

app.listen(port, () => console.log(`SERVER IS RUNNING ON PORT ${port}`))