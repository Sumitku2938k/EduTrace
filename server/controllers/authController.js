const User = require('../models/userModel');

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        const user = await User.create({ name, email, password, role });
        const token = user.generateToken();

        return res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ message: 'Failed to register user' });
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = user.generateToken();

        return res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return next(error);
    }
};

const getUser = async (req, res) => {
    try {
        return res.status(200).json({
            user: {
                id: req.user._id.toString(),
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
            },
        });
    } catch (error) {
        console.error('Get user error:', error);
        return res.status(500).json({ message: 'Failed to fetch user' });
    }
};

module.exports = { register, login, getUser };
