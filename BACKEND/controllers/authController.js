const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userRegistration = async (req,res) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                message: "Username, email and password is required!"
            })
        }

        const existingUser = await User.findOne({ email });
        if(existingUser){
            return res.status(409).json({
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(201).json({
            message: "User registered successfully!",
            token,
            user: {
                id: user._id,
                email: user.email
            }
        })

    } catch(error) {
        return res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
};

const userLogin = async (req,res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required!"
            });
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({
                message: "Invalid email or password!"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({
                message: "Invalid email or password!"
            })
        }

        const token = jwt.sign({ id:user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

        return res.status(200).json({
            message: "User login successfully!",
            token,
            user: {
                id: user._id,
                email: user.email
            }
        })

    } catch(error){
        return res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
}

module.exports = { userRegistration, userLogin };