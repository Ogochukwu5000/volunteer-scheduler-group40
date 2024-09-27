const UserModel = require("../models/users");
const {hashPassword, comparePassword} = require("../helpers/auth");
const jwt = require("jsonwebtoken");


const test = (req, res)=>{
    res.json("test is working")
}
//reason why it is async is because requesting data from a database is an asynchronous function not instantaneous
const registerUser = async (req, res) => {
    try {
        const {username, password} = req.body;
        //Check if name was entered
        if (!username){
            return res.json({
                error: "Username is required"
            })
        }
        //Check if password is good or if entere at all
        if (!password || password.length < 6){
            return res.json({
                error: "Invalid Password"
            })
        }
        const user = await UserModel.findOne( {username} );
        //check if user already exists
        if(user){
            return res.json({
                error: "USER ALREADY EXISTS"})
        }
        const newUser = new UserModel({username, password});
        const hashedPassword = await hashPassword(password)
        await newUser.save();
        res.json({message: "USER REGISTERED SUCCESSFULLY",
                  username: newUser.username
                });
        
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errorMessage = Object.values(error.errors)[0].message;
            return res.json({
                error: errorMessage
            });
        }
        console.log(error)
    }
    
}
const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body;
        //Check if name was entered
        const user = await UserModel.findOne( {username} );
        //check if user already exists
        if(!user){
            return res.json({
                error: "USER NOT FOUND"})
        }
        const isPasswordValid = await comparePassword(password, user.password)

        if(!isPasswordValid){
            return res.json({message: "PASSWORD IS INCORRECT"})
        }
        else{
            jwt.sign({username: user.username,
                      id: user._id
                }, process.env.JWT_SECRET,
                {},
                (err, token) =>{
                    if (err) throw err
                    res.cookie("token", token).json(user)
                }
                ) 
            return res.json({message: "Login Successful"})
        }
        if (!username){
            return res.json({
                error: "Username is required"
            })
        }
        //Check if password is good or if entere at all
        if (!password || password.length < 6){
            return res.json({
                error: "Invalid Password"
            })
        }
        
    } catch (error) {
        console.log(error)
    }


}

const getProfile = (req, res) =>{
    const {token} = req.cookies;
    if (token){
        jwt.verify(token,process.env.JWT_SECRET, {}, (err, user) =>{
            if (err) {throw err}
            res.json(user)
        })
    }
    else{ res.json(null)}
}

module.exports = {test, registerUser, loginUser, getProfile}