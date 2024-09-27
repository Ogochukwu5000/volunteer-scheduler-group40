const express = require('express');

const router = express.Router();

const cors = require('cors');
//the test must be in curly braces
const {test, registerUser, loginUser, getProfile} = require('../controllers/authController')

//middleware 
router.use(
    cors({
        credentials: true,
        origin: 'http://localhost:5173'//never have a trailing slash as in "http://localhost:5173/"
    })

)
//test is a function name
router.get('/', test)
router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', getProfile)


module.exports = router