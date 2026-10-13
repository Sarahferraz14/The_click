import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    userId?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET!) as jwt.JwtPayload;
        req.userId = payload.sub as string;
        next();
    } catch {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}