/**
 * @file Authentication helpers for hashing passwords and handling JWTs.
 */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Hashes a plaintext password using bcrypt.
 *
 * @param password Raw password provided by the user.
 * @returns Promise resolving to the hashed password string.
 */
export const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, 10);
};

/**
 * Compares a plaintext password against a hashed value.
 *
 * @param password Raw password provided during login.
 * @param hashedPassword Stored hashed password.
 * @returns Promise resolving to `true` when the password matches.
 */
export const comparePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};

/**
 * Generates a signed JWT for the provided payload.
 *
 * @param payload Serializable payload containing user context.
 * @returns Signed JWT string that expires in 24 hours.
 */
export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

/**
 * Validates a JWT and returns its decoded payload.
 *
 * @param token JWT string extracted from the request.
 * @returns Decoded token payload if signature and expiry are valid.
 */
export const verifyToken = (token: string): any => {
    return jwt.verify(token, JWT_SECRET);
};
