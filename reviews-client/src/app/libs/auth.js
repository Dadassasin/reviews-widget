// src/app/libs/auth.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import 'dotenv/config';

export async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}
export async function verifyPassword(plain, hash) {
    return bcrypt.compare(plain, hash);
}

export function signJwt(payload) {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '1d'
        }
    );
}

export function verifyJwt(token) {
    return jwt.verify(
        token,
        process.env.JWT_SECRET
    );
}
