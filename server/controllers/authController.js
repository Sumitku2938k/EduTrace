const User = require('../models/userModel');

const DEMO_LOGIN_EMAIL = (process.env.DEMO_LOGIN_EMAIL || 'demo@edutrace.app').toLowerCase();
const DEMO_LOGIN_PASSWORD = process.env.DEMO_LOGIN_PASSWORD || 'Demo@12345';
const DEMO_LOGIN_NAME = process.env.DEMO_LOGIN_NAME || 'EduTrace Demo';
const DEMO_LOGIN_ROLE = process.env.DEMO_LOGIN_ROLE || 'admin';
const DEMO_LOGIN_ENABLED = process.env.DEMO_LOGIN_ENABLED !== 'false';

const buildUserResponse = (user) => ({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
});

const ensureDemoUser = async () => {
    let demoUser = await User.findOne({ email: DEMO_LOGIN_EMAIL });

    if (!demoUser) {
        return User.create({
            name: DEMO_LOGIN_NAME,
            email: DEMO_LOGIN_EMAIL,
            password: DEMO_LOGIN_PASSWORD,
            role: DEMO_LOGIN_ROLE,
        });
    }

    let shouldSave = false;
    const hasExpectedPassword = await demoUser.comparePassword(DEMO_LOGIN_PASSWORD);

    if (!hasExpectedPassword) {
        demoUser.password = DEMO_LOGIN_PASSWORD;
        shouldSave = true;
    }

    if (demoUser.name !== DEMO_LOGIN_NAME) {
        demoUser.name = DEMO_LOGIN_NAME;
        shouldSave = true;
    }

    if (demoUser.role !== DEMO_LOGIN_ROLE) {
        demoUser.role = DEMO_LOGIN_ROLE;
        shouldSave = true;
    }

    return shouldSave ? demoUser.save() : demoUser;
};

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
            user: buildUserResponse(user),
        });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ message: 'Failed to register user' });
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (DEMO_LOGIN_ENABLED && email === DEMO_LOGIN_EMAIL && password === DEMO_LOGIN_PASSWORD) {
            const demoUser = await ensureDemoUser();
            const token = demoUser.generateToken();

            return res.status(200).json({
                message: 'Demo login successful',
                token,
                user: buildUserResponse(demoUser),
            });
        }

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
            user: buildUserResponse(user),
        });
    } catch (error) {
        console.error('Login error:', error);
        return next(error);
    }
};

const getUser = async (req, res) => {
    try {
        return res.status(200).json({
            user: buildUserResponse(req.user),
        });
    } catch (error) {
        console.error('Get user error:', error);
        return res.status(500).json({ message: 'Failed to fetch user' });
    }
};

module.exports = { register, login, getUser };
