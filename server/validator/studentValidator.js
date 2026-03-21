const { z } = require('zod');

const createStudentSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, 'Name must be at least 3 characters')
        .max(50, 'Name is too long'),

    rollNo: z
        .string()
        .trim()
        .min(1, 'Roll number is required')
        .max(30, 'Roll number is too long'),

    email: z
        .string()
        .trim()
        .email('Please provide a valid email address')
        .max(100, 'Email is too long'),

    department: z
        .string()
        .trim()
        .min(2, 'Department must be at least 2 characters')
        .max(60, 'Department is too long'),
});

const updateStudentSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(3, 'Name must be at least 3 characters')
            .max(50, 'Name is too long')
            .optional(),

        rollNo: z
            .string()
            .trim()
            .min(1, 'Roll number is required')
            .max(30, 'Roll number is too long')
            .optional(),

        email: z
            .string()
            .trim()
            .email('Please provide a valid email address')
            .max(100, 'Email is too long')
            .optional(),

        department: z
            .string()
            .trim()
            .min(2, 'Department must be at least 2 characters')
            .max(60, 'Department is too long')
            .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field is required for update',
    });

module.exports = { createStudentSchema, updateStudentSchema };