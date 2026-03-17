const {z} = require('zod');

// Validation schema for user registration
const signUpSchema = z.object({
    username: z
        .string()
        .trim()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username too long"),

    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email"),

    phone: z
        .string()
        .trim()
        .min(10, "Phone number must be at least 10 characters"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
});

const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email("Invalid email"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
});

module.exports = { signUpSchema, loginSchema };