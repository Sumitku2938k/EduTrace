const home = (req, res) => {
    res.status(200).send("Welcome to the Auth API");
};

const register = (req, res) => {
    // Registration logic here
    res.status(201).send("User registered successfully");
}

module.exports = {home, register};