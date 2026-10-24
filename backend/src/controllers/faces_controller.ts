import type { Response } from 'express';
import { prisma } from '../lib/prisma';
import type { AuthRequest } from '../middleware/auth';

const FACE_URL = process.env.FACE_SERVICE_URL ?? 'http://127.0.0.1:8001';
const ANGLES = ['front', 'left', 'right'];

export async function enrollFace(req: AuthRequest, res: Response) {
    try {
        const angle = String(req.body?.angle ?? '');
        const file = req.file;

        if (!ANGLES.includes(angle)) return res.status(400).json({ error: 'Ângulo inválido' });
        if (!file) return res.status(400).json({ error: 'Foto não enviada' });
        if (req.body?.consent !== 'true') {
            return res.status(400).json({ error: 'É necessário aceitar o termo de consentimento' });
        }

        const user = await prisma.user.findUnique({ where: { id: req.userId } });
        if (!user || user.deleted_at) return res.status(404).json({ error: 'Usuário não encontrado' });

        // 1) manda a foto para o serviço Python
        const form = new FormData();
        form.append('image', new Blob([new Uint8Array(file.buffer)], { type: file.mimetype }), 'face.jpg');
        form.append('angle', angle);

        let r: Response | any;
        try {
            r = await fetch(`${FACE_URL}/embed`, { method: 'POST', body: form });
        } catch {
            return res.status(503).json({ error: 'Serviço de reconhecimento indisponível' });
        }
        const out: any = await r.json().catch(() => null);
        if (!r.ok || !out) {
            return res.status(422).json({ error: out?.detail ?? 'Não foi possível processar o rosto' });
        }

        // 2) acha (ou cria) a casa do usuário
        const member =
            (await prisma.homeMember.findFirst({ where: { user_id: user.id, role: 'owner' } })) ??
            (await prisma.homeMember.create({
                data: {
                    role: 'owner',
                    user: { connect: { id: user.id } },
                    home: { create: { name: `Casa de ${user.full_name}` } },
                },
            }));

        // 3) acha (ou cria) a pessoa conhecida; consent_at é gravado na criação
        const person =
            (await prisma.knownPerson.findFirst({
                where: { home_id: member.home_id, consent_by: user.id, relationship: 'self' },
            })) ??
            (await prisma.knownPerson.create({
                data: {
                    home_id: member.home_id,
                    full_name: user.full_name,
                    relationship: 'self',
                    consent_at: new Date(),
                    consent_by: user.id,
                },
            }));

        // 4) grava o vetor (o Prisma não manipula o tipo vector, por isso SQL puro)
        const vec = `[${out.embedding.join(',')}]`;
        await prisma.$executeRaw`
            INSERT INTO face_embeddings (person_id, angle, embedding, model_ver)
            VALUES (${person.id}::uuid, ${angle}::face_angle, ${vec}::vector, ${out.model_ver})
            ON CONFLICT (person_id, angle, model_ver)
            DO UPDATE SET embedding = EXCLUDED.embedding, created_at = now()`;

        await prisma.auditLog.create({
            data: {
                home_id: member.home_id,
                user_id: user.id,
                action: 'face_enrolled',
                entity: 'known_person',
                entity_id: person.id,
                metadata: { angle },
            },
        });

        return res.json({ ok: true, angle });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}