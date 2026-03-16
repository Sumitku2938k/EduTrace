const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({  // Define the User schema
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

//Secure the password with the bcrypt
userSchema.pre("save", async function (next) { //User ka data, db mein store/save hone se pehle jo karna hai 
    const user = this; //User ka sara data this ke andar hota hai  

    if(!user.isModified("password")){  //Use ka password modify nahi hua ho tab
        return next();
    }

    try{
        const salt = await bcrypt.genSalt(10);  //Generate salt for hashing -> kitna complex password hoga 
        const hashedPassword = await bcrypt.hash(user.password, salt); //Hash the password with salt
        user.password = hashedPassword;
    }catch(error){
        console.log("Error in hashing password", error);
    }
})

//JSON Web Token
userSchema.methods.generateToken = async function (){  //userSchema.methods se kitne bhi functions create kar sakte hai hum and usse controllers mein use kar sakte hai 
    try{
        return jwt.sign({ //
            userId: this._id.toString(),
            email: this.email,
            isAdmin: this.isAdmin,
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: "30d",
        }
        );
    }catch(error){
        console.log(error);
    }
}

//isValidPassword method to compare password during login
userSchema.methods.comparePassword = async function(password){
    try{
        return bcrypt.compare(password, this.password); //Compare the provided password with the hashed password
    }catch(error){
        console.log("Error in comparing password", error);
    }
}

//define the model or the collection name 
const User = mongoose.model('User',userSchema);
module.exports = User;