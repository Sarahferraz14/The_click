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

const MATCH_THRESHOLD = 0.60

export async function recognizeFace(req: AuthRequest, res: Response) {
    try {
        const file = req.file;
        if(!file) return res.status(400).json({ error: 'Foto não enviada!' });

        const member = await prisma.homeMember.findFirst({
            where: { user_id: req.userId, role: 'owner' },
        });
        if(!member) return res.status(404).json({ error: 'Nenhuma cadastrada' });

        const form = new FormData();
        form.append('image', new Blob([new Uint8Array(file.buffer)], { type: file.mimetype }), 'face.jpg');
        form.append('angle', 'any');

        let r;
        try {
            r = await fetch(`${FACE_URL}/embed`, { method: 'POST', body: form });
        } catch {
            return res.status(503).json({ error: 'Serviço de reconhecimento indisponível!' });
        }
        const out: any = await r.json().catch(() => null);
        if(!r.ok || !out) {
            return res.status(422).json({ error: out?.detail ?? 'Não foi possível porcessar o rosto!' });
        }

        const vec = `[${out.embedding.join(',')}]`;
        const rows = await prisma.$queryRaw<{ person_id: string; full_name: string; similarity: number }[]>`
            SELECT p.id AS person_id, p.full_name, 1 - (fe.embedding <=> ${vec}::vector) AS similarity
            FROM face_embeddings fe
            JOIN known_people p ON p.id = fe.person_id
            WHERE p.home_id = ${member.home_id}::uuid
            ORDER BY fe.embedding <=> ${vec}::vector
            LIMIT 1`;

        const best = rows[0];
        const recognized = !!best && best.similarity >= MATCH_THRESHOLD;

        await prisma.event.create({
            data: {
                home_id: member.home_id,
                person_id: recognized ? best.person_id : null,
                kind: recognized ? 'face_recognized' : 'face_unknown',
                source: 'camera',
                confidence: best ? best.similarity : null,
            },
        });

        return res.json(
            recognized
                ? { recognized: true, name: best.full_name, confidence: best.similarity }
                : { recognized: false }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
}