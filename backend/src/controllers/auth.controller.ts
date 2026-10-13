import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createHash, randomBytes } from 'node:crypto';
import { prisma } from '../lib/prisma';
import { sendPasswordResetEmail } from '../lib/mailer';
import type { AuthRequest } from '../middleware/auth';

const ACCESS_TTL = '15m';
const REFRESH_TTL_DAYS = 30;
const RESET_TLL_MS = 60 *60 *1000; // 1 hour
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');

function signAccessToken(userId: string) {
    return jwt.sign({ sub: userId }, process.env.JWT_SECRET!, { expiresIn: ACCESS_TTL });
}

async function createSession(userId: string, req: Request) {
    const refreshToken = randomBytes(48).toString('hex');
    await prisma.session.create({
        data: {
            user_id: userId,
            token_hash: sha256(refreshToken),
            user_agent: req.headers['user-agent'] ?? null,
            ip_address: req.ip ?? null,
            expires_at: new Date(Date.now() + REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000),
        },
    });
    return refreshToken;
}

async function issueTokens(userId: string, req: Request) {
    return {
        accessToken: signAccessToken(userId),
        refreshToken: await createSession(userId, req),
    };
}

function publicUser(user: { id: string; full_name: string; email: string, language: string }) {
    return {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        language: user.language
    };
}

export async function register(req: Request, res: Response) {
    try {
        const { full_name, email, password, language } = req.body ?? {};

        if (typeof full_name !== 'string' || full_name.trim().length < 3) {
            return res.status(400).json({ message: 'Full name must be at least 3 characters long' });
        }
        if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }
        if (typeof password !== 'string' || password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }
        if (typeof language !== 'undefined' && !['pt', 'en', 'es', 'fr'].includes(language)) {
            return res.status(400).json({ message: 'Invalid language' });
        }

        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const user = await prisma.user.create({
            data: {
                full_name: full_name.trim(),
                email,
                password_hash: await bcrypt.hash(password, 10),
                ...(language ? { language } : {}),
            },
        });

        return res.status(201).json({ user: publicUser(user), ...await issueTokens(user.id, req) });
    } catch (error: any) {
        if (error?.code === 'P2002') {
            return res.status(400).json({ message: 'Email already in use' });
        }
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body ?? {};
        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ error: "Informe e-mail e senha" });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        const valid = user && !user.deleted_at && (await bcrypt.compare(password, user.password_hash));
        if (!user || !valid) {
             return res.status(401).json({ error: "E-mail ou senha incorretos" });
        }

        await prisma.user.update({ where: { id: user.id }, data: { last_login_at: new Date() } });
        return res.json({ user: publicUser(user), ...(await issueTokens(user.id, req)) });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
}

export async function refresh(req: Request, res: Response) {
    try {
        const { refresh_token } = req.body ?? {};
        if (typeof refresh_token !== "string") {
            return res.status(400).json({ error: "refresh_token não informado" });
        }
 
        const session = await prisma.session.findUnique({
            where: { token_hash: sha256(refresh_token) },
            include: { user: true },
        });
 
        if (!session || session.revoked_at || session.expires_at < new Date() || session.user.deleted_at) {
            return res.status(401).json({ error: "Sessão inválida ou expirada" });
        }
 
        await prisma.session.update({ where: { id: session.id }, data: { revoked_at: new Date() } });
        return res.json(await issueTokens(session.user_id, req));
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}
 
export async function logout(req: Request, res: Response) {
    try {
        const { refresh_token } = req.body ?? {};
        if (typeof refresh_token === "string") {
            await prisma.session.updateMany({
                where: { token_hash: sha256(refresh_token), revoked_at: null },
                data: { revoked_at: new Date() },
            });
        }
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}
 
export async function me(req: AuthRequest, res: Response) {
    try {
        const user = await prisma.user.findUnique({ where: { id: req.userId } });
        if (!user || user.deleted_at) return res.status(404).json({ error: "Usuário não encontrado" });
        return res.json({ user: publicUser(user) });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro interno do servidor" });
    }
}

export async function forgotPassword(req: Request, res: Response) {
    try {
        const { email } = req.body ?? {};
        if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
            return res.status(400).json({ message: 'Informe um e-mail válido' });
        }

        const user = await prisma.user.findUnique({ where: { email: email.trim() } });
        if (user && !user.deleted_at) {
            const token = randomBytes(32).toString('hex');

            await prisma.$transaction([
                prisma.passwordResetToken.deleteMany({ where: { user_id: user.id, used_at: null } }),
                prisma.passwordResetToken.create({
                    data: {
                        user_id: user.id,
                        token_hash: sha256(token),
                        expires_at: new Date(Date.now() + RESET_TLL_MS),
                    },
                }),
            ]);

            sendPasswordResetEmail(user.email, token, user.language).catch((err) => {
                console.error('Falha ao enviar e-mail de redefinição de senha:', err);
            });
        }

        return res.json({
            message: 'Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha',
        });
    } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno do servidor' });
    }
}

export async function resetPassword(req: Request, res: Response) {
    try {
        const { token, new_password } = req.body ?? {};
        if (typeof token !== 'string' || !token) {
            return res.status(400).json({ message: 'Token inválido' });
        }
        if (typeof new_password !== 'string' || new_password.length < 8) {
            return res.status(400).json({ message: 'A nova senha deve ter pelo menos 8 caracteres' });
        }

        const record = await prisma.passwordResetToken.findUnique({
            where: { token_hash: sha256(token) },
            include: { user: true },
        });

        if (!record || record.used_at || record.expires_at < new Date() || record.user.deleted_at) {
            return res.status(400).json({ message: 'Token inválido ou expirado' });
        }

        const password_hash = await bcrypt.hash(new_password, 10);
        const now = new Date();

        await prisma.$transaction(async (tx) => {
            const claimed = await tx.passwordResetToken.updateMany({
                where: { id: record.id, used_at: null },
                data: { used_at: now },
            });
            if (claimed.count == 0) throw new Error('Token já foi usado');

            await tx.user.update({
                where: { id: record.user_id },
                data: { password_hash, updated_at: now },
            });

            await tx.session.updateMany({
                where: { user_id: record.user_id, revoked_at: null },
                data: { revoked_at: now },
            });
        });

        return res.json({ message: 'Senha redefinida com sucesso' });
    } catch (error: any) {
        if (error?.message === 'Token já foi usado') {
            return res.status(400).json({ message: 'Token expirado ou já usado' });
        }
        console.error(error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
}