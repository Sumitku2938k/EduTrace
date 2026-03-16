const User = require("../models/user-model");
const bcrypt = require('bcryptjs');

const home = async (req, res) => {
    try {
        res.send("Hello, World!");
    } catch (error) {
        console.log(error);
    }
};

//1. Get Registration Data : Retrieve user data from request body (username, email, phone, password).
//2. Check Existing User : Check if a user with the provided email already exists in the database
//3. Hash Password : If no existing user is found, hash the provided password for security
//4. Create New User : If no existing user is found, create a new user with the provided data and hashed password
//5. Save User to Database : Save the newly created user to the database
//6. Send Response : Send a success response with the created user data or an error message if the user already exists

const register = async (req, res) => {
    try {
        const { username, email, phone, password } = req.body; //Get user data from request body

        const userExists = await User.findOne({ email }); //Check if user already exists

        if (userExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const userCreated = await User.create({ username, email, phone, password }); //Create new user

        console.log("Registered User:",req.body); //Log the request body to verify the received data
        res
            .status(200)
            .json({
                message: "User Registered Successfully",
                user: userCreated,
                // token: await userCreated.generateToken(), //token generate karna hai
                // userId: userCreated._id.toString(),

        //In most cases, user id ko string mein convert karna padta hai bcz mongoose object id hota hai jo ki string nahi hota
        //and it ensures compatibility and consistency across different JWT libraries and systems. It also aligns with common
        //practices in web development where user identifiers are typically represented as strings.
        }); 
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ msg: "Page Not Found" });
    }
};

//User Login Controller
// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body; //Get email and password from request body
//     const userExist = await User.findOne({ email }); //Check user exist by email

//     if (!userExist) { //If user not found
//       return res.status(400).json({ message: "Invalid Credentials" });
//     }
//     const isPasswordValid = await userExist.comparePassword(password); //Compare password

//     if(isPasswordValid){
//       res.status(200).json({
//         message: "User Logged In Successfully",
//         //user: user,
//         token: await userExist.generateToken(),
//         userId: userExist._id.toString(),
//       });
//     }else{
//       res.status(401).json({ msg: "Invalid email or password" });
//     }
    
//   } catch (error) {
//     console.error('Login error:', error);
//     //res.status(500).json({ msg: "Internal Server Error" });
//     next(error);
//   }
// };

//To send user data - User Logic
// const user = async (req, res) => {
//   try {
//     const userData = req.user;
//     console.log(userData);
//     res.status(200).json({ userData });
//   } catch (error) {
//     console.log(`Error from the user route ${error}`);
//   }
// };

module.exports = { home, register };