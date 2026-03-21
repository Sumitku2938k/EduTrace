const { z } = require('zod');

const signUpSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name is too long'),
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email('Invalid email'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters'),
    role: z.enum(['admin', 'student']).optional(),
});

const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .toLowerCase()
        .email('Invalid email'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters'),
});

module.exports = { signUpSchema, loginSchema };
