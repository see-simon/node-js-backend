import bcrypt from 'bcryptjs';
import { db } from '../server.js';

export const registerUser = async (user) => {
    try {
        // Check for existing email
        const emailCheckQuery = 'SELECT * FROM users WHERE email = ?';
        const [existing] = await new Promise((resolve, reject) => {
            db.query(emailCheckQuery, [user.email], (err, result) => {
                if (err) return reject(err);
                resolve([result]);
            });
        });

        if (existing.length > 0) {
            return { success: false, message: 'Email already registered' };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, 10);

        const insertQuery = 'INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)';
        const values = [user.name, user.surname, user.email, hashedPassword];

        await new Promise((resolve, reject) => {
            db.query(insertQuery, values, (err, result) => {
                if (err) return reject(err);
                resolve(result);
            });
        });

        return { success: true, message: 'User registered successfully' };

    } catch (error) {
        console.error('Error registering user:', error);
        return { success: false, message: 'Error registering user' };
    }
};
export const loginUser = async (email, password) => {
    try {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [users] = await new Promise((resolve, reject) => {
            db.query(query, [email], (err, result) => {
                if (err) return reject(err);
                resolve([result]);
            });
        });

        if (users.length === 0) {
            return { success: false, message: 'Invalid email or password' };
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return { success: false, message: 'Invalid email or password' };
        }

        return { success: true, userId: user.id, message: 'Login successful' };

    } catch (error) {
        console.error('Error logging in user:', error);
        return { success: false, message: 'Error logging in user' };
    }
};
