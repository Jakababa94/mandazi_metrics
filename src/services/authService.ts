import db, { generateId } from '../db/db';
import type { User } from '../types/schema';

export const authService = {
    async signup(name: string, email: string, password: string) {
        // Check if user exists
        const existing = await db.find({
            selector: {
                type: 'user',
                email: email
            }
        });

        if (existing.docs.length > 0) {
            throw new Error('User already exists');
        }

        const newUser: User = {
            _id: generateId('user'),
            type: 'user',
            name,
            email,
            passwordHash: password, // simplified for local demo
            createdAt: new Date().toISOString()
        };

        await db.put(newUser);
        return newUser;
    },

    async login(email: string, password: string) {
        const result = await db.find({
            selector: {
                type: 'user',
                email: email,
                passwordHash: password
            }
        });

        if (result.docs.length === 0) {
            throw new Error('Invalid credentials');
        }

        return result.docs[0] as User;
    }
};
