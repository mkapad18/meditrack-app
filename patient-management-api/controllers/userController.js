const User = require("../models/User");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

//register routes
const registerUser = async (req, res) => {
    const {username, email , password} = req.body
    console.log(req.body)

    try{
        //check if user already exists
        const user = await User.findOne({username})
        if(user) return res.status(400).json({message: 'User already exists'})


        //hash the password
        const hashPassword = await bcrypt.hash(password,10);

        //create a new user
        const newUser = new User({username, email, password: hashPassword})
        await newUser.save()

        res.json({message: 'User registered successfully'})
    }
    catch(err){
        console.error(err.message)
        res.status(500).send('Server error')
    }
}


//login routes
const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate a token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, userId: user._id }); // Return user ID along with the token
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const getLoggedinUser =async (req, res) => {
    const {token} = req.body
    // console.log("token", token)
    // if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });    
    console.log(token)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //   req.user = decoded;
    const data = await User.findOne({_id:decoded.id})
    console.log("decoded",data)
      res.json(data);
    
}

module.exports = {registerUser, loginUser,getLoggedinUser}