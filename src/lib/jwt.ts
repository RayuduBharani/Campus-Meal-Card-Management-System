import jwt from 'jsonwebtoken'
import type { User } from './auth'

const JWT_SECRET = process.env.JWT_SECRET || 'bharani'
const JWT_EXPIRES_IN = '7d'

export function createToken(payload: Partial<User>) {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    })
}

export function verifyToken(token: string): Partial<User> {
    try {
        return jwt.verify(token, JWT_SECRET) as Partial<User>
    } catch {
        throw new Error('Invalid token')
    }
}
