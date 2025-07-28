import UserModel from "../../models/userModel.js";
import { registerUser } from "../../services/authService.js";
import { loginUser } from "../../services/authService.js";

export const register = async (req, res) => {
    const { name, surname, email, password, confirmPassword } = req.body;

    if (!name || !surname || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    const user = new UserModel({ name, surname, email, password });

    try {
        const result = await registerUser(user);

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        return res.status(200).json({
            message: 'User created successfully',
            user: result.user || null
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const result = await loginUser(email, password);

        if (!result.success) {
            return res.status(401).json({ message: result.message });
        }

        // You can add token generation here if needed
        return res.status(200).json({
            message: 'Login successful',
            userId: result.userId
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error logging in', error: error.message });
    }
}

