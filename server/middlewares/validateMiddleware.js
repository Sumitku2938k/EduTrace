const validate =  (schema) => async (req, res, next) => {
    try {
        const parseBody = await schema.parseAsync(req.body); // Validate the request body against the provided schema
        req.body = parseBody;
        next();
    } catch (err) {
        let message = 'Invalid request data';

        if(err && Array.isArray(err.errors)  && err.errors.length > 0) {
            message = err.errors[0].message;
        }else if (err && Array.isArray(err.issues)  && err.issues.length > 0) {
            message = err.issues[0].message;
        }else if (err && Array.isArray(err.details)  && err.details.length > 0) {
            message = err.details[0].message;
        }else if (err && err.message) {
            message = err.message;
        }

        console.log("Validation Error: ", message);
        res.status(400).json({msg: message});
    }
}

module.exports = validate;