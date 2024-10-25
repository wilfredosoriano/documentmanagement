import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().email('Invalid email format').nonempty('Email is required'),
    password: z.string().min(6, 'Password must be atleast 6 characters long').nonempty('Password is required')
});