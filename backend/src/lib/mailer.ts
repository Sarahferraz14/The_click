import 'dotenv/config';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const TEXTS: Record<string, { subject: string; intro: string; cta: string, footer: string }> = {
    pt: {
        subject: 'Redefinição de senha - TheClick',
        intro: 'Recebemos um pedido para redefinir a sua senha.',
        cta: 'Redefinir sua senha:',
        footer: 'O link vale por 1 hora. Se você não fez o pedido, ignore este e-mail.',
    },
    en: {
        subject: 'Password reset - TheClick',
        intro: 'We received a request to reset your password.',
        cta: 'Reset password',
        footer: 'This link is valid for 1 hour. If you did not request it, ignore this e-mail.',
    },
    es: {
        subject: 'Restablecer contraseña - TheClick',
        intro: 'Recibimos una solicitud para restablecer tu contraseña.',
        cta: 'Restablecer contraseña',
        footer: 'El enlace es válido por 1 hora. Si no lo solicitaste, ignora este correo.',
    },
    fr: {
        subject: 'Réinitialisation du mot de passe - TheClick',
        intro: 'Nous avons reçu une demande de réinitialisation de votre mot de passe.',
        cta: 'Réinitialiser le mot de passe',
        footer: "Ce lien est valable 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.",
    },
};

export async function sendPasswordResetEmail(to: string, token: string, language: string = 'pt') {
    const t =  TEXTS[language] ?? TEXTS.pt;
    const base = process.env.APP_URL ?? 'http://localhost:3000';
    const link = `${base}/pages/the-click.html?reset_token=${token}`;

    console.log('LINK DE RESET:', link);

    const {error} = await resend.emails.send({
        from: process.env.MAIL_FROM!,
        to,
        subject: t.subject,
        text: `${t.intro}\n\n${link}\n\n${t.footer}`,
        html: `
            <p>${t.intro}</p>
            <p><a href="${link}">${t.cta}</a></p>
            <p style="color: #666; font-size: 13px;">${t.footer}</p>
        `
    });
    if (error) throw new Error(error.message);
}